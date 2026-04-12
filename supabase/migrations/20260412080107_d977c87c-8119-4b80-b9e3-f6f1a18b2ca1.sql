
-- Add missing columns to store_domains
ALTER TABLE public.store_domains
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS dns_auto_configured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dns_setup_error TEXT,
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Add check constraints
ALTER TABLE public.store_domains
  DROP CONSTRAINT IF EXISTS store_domains_provider_check,
  ADD CONSTRAINT store_domains_provider_check CHECK (provider IN ('namecheap', 'cloudflare', 'manual'));

ALTER TABLE public.store_domains
  DROP CONSTRAINT IF EXISTS store_domains_status_check,
  ADD CONSTRAINT store_domains_status_check CHECK (status IN ('pending', 'active', 'failed', 'expired'));

-- Unique constraint
ALTER TABLE public.store_domains
  DROP CONSTRAINT IF EXISTS store_domains_store_id_domain_key;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'store_domains_store_domain_unique'
  ) THEN
    ALTER TABLE public.store_domains ADD CONSTRAINT store_domains_store_domain_unique UNIQUE(store_id, domain);
  END IF;
END$$;

-- Enable RLS
ALTER TABLE public.store_domains ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any, then recreate
DROP POLICY IF EXISTS "Owners can view their store domains" ON public.store_domains;
DROP POLICY IF EXISTS "Owners can insert store domains" ON public.store_domains;
DROP POLICY IF EXISTS "Owners can update their store domains" ON public.store_domains;
DROP POLICY IF EXISTS "Owners can delete their store domains" ON public.store_domains;

CREATE POLICY "Owners can view their store domains"
  ON public.store_domains FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can insert store domains"
  ON public.store_domains FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their store domains"
  ON public.store_domains FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their store domains"
  ON public.store_domains FOR DELETE
  USING (auth.uid() = user_id);

-- Timestamp trigger
DROP TRIGGER IF EXISTS update_store_domains_updated_at ON public.store_domains;
CREATE TRIGGER update_store_domains_updated_at
  BEFORE UPDATE ON public.store_domains
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
