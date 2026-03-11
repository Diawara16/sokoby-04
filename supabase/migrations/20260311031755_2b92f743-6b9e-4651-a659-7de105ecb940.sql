
-- Add slug column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;

-- Add SEO columns to store_settings
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS seo_description text;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS og_image_url text;

-- Add SEO columns to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_description text;

-- Backfill with unique slugs (append row number for duplicates)
WITH slugged AS (
  SELECT id, store_id,
    lower(trim(both '-' from regexp_replace(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'), '-+', '-', 'g'))) as base_slug,
    ROW_NUMBER() OVER (
      PARTITION BY store_id, lower(trim(both '-' from regexp_replace(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'), '-+', '-', 'g')))
      ORDER BY created_at
    ) as rn
  FROM public.products
)
UPDATE public.products p
SET slug = CASE WHEN s.rn = 1 THEN s.base_slug ELSE s.base_slug || '-' || s.rn END
FROM slugged s
WHERE p.id = s.id;

-- Create unique index on slug per store
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug_store ON public.products (store_id, slug);

-- Function to generate slug from product name on insert/update
CREATE OR REPLACE FUNCTION public.generate_product_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9\s-]', '', 'g'));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(both '-' from base_slug);
    
    final_slug := base_slug;
    
    LOOP
      IF NOT EXISTS (
        SELECT 1 FROM public.products 
        WHERE slug = final_slug 
        AND store_id IS NOT DISTINCT FROM NEW.store_id
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      ) THEN
        EXIT;
      END IF;
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for auto-generating slugs
DROP TRIGGER IF EXISTS trigger_generate_product_slug ON public.products;
CREATE TRIGGER trigger_generate_product_slug
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_product_slug();
