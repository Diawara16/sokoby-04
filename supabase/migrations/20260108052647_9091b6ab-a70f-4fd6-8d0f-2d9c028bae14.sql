-- 1) Add store_id column to products if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'store_id'
  ) THEN
    ALTER TABLE public.products ADD COLUMN store_id uuid NULL;
  END IF;
END$$;

-- 2) Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_store_id_fkey'
    AND table_name = 'products'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_store_id_fkey
      FOREIGN KEY (store_id) REFERENCES public.store_settings(id)
      ON DELETE SET NULL;
  END IF;
END$$;

-- 3) Add published column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'published'
  ) THEN
    ALTER TABLE public.products ADD COLUMN published boolean NOT NULL DEFAULT true;
  END IF;
END$$;

-- 4) Helpful index for LIVE storefront queries
CREATE INDEX IF NOT EXISTS idx_products_store_visibility
  ON public.products (store_id, is_visible, status);

-- 5) Auto-assign store_id on INSERT (covers all future imports/creates)
CREATE OR REPLACE FUNCTION public.set_product_store_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_store_id uuid;
BEGIN
  IF NEW.store_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- If the creator is a staff member, attach to their store
  SELECT sm.store_id
  INTO v_store_id
  FROM public.staff_members sm
  WHERE sm.user_id = NEW.user_id
    AND sm.status = 'active'
  LIMIT 1;

  IF v_store_id IS NOT NULL THEN
    NEW.store_id := v_store_id;
    RETURN NEW;
  END IF;

  -- Otherwise attach to the user's production store (most recent)
  SELECT ss.id
  INTO v_store_id
  FROM public.store_settings ss
  WHERE ss.user_id = NEW.user_id
    AND ss.is_production = true
  ORDER BY ss.created_at DESC
  LIMIT 1;

  IF v_store_id IS NOT NULL THEN
    NEW.store_id := v_store_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_product_store_id_before_insert ON public.products;
CREATE TRIGGER set_product_store_id_before_insert
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.set_product_store_id();

-- 6) Backfill store_id for existing products (owners)
UPDATE public.products p
SET store_id = (
  SELECT ss.id FROM public.store_settings ss
  WHERE ss.user_id = p.user_id AND ss.is_production = true
  ORDER BY ss.created_at DESC LIMIT 1
)
WHERE p.store_id IS NULL AND p.user_id IS NOT NULL;

-- 7) Backfill store_id for existing products created by staff
UPDATE public.products p
SET store_id = (
  SELECT sm.store_id FROM public.staff_members sm
  WHERE sm.user_id = p.user_id AND sm.status = 'active'
  LIMIT 1
)
WHERE p.store_id IS NULL AND p.user_id IS NOT NULL;

-- 8) Migrate existing ACTIVE ai_generated_products into products
INSERT INTO public.products (
  id,
  store_id,
  user_id,
  name,
  description,
  price,
  image,
  category,
  stock,
  status,
  is_visible,
  created_at
)
SELECT
  gen.id,
  gen.store_id,
  gen.user_id,
  gen.name,
  gen.description,
  gen.price,
  gen.image_url,
  gen.niche,
  0,
  'active',
  true,
  gen.created_at
FROM public.ai_generated_products gen
WHERE gen.store_id IS NOT NULL
  AND COALESCE(gen.status, 'active') = 'active'
ON CONFLICT (id) DO NOTHING;