ALTER TABLE public.domain_purchases
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS years INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS trg_domain_purchases_updated_at ON public.domain_purchases;
CREATE TRIGGER trg_domain_purchases_updated_at
BEFORE UPDATE ON public.domain_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE UNIQUE INDEX IF NOT EXISTS idx_domain_purchases_active_unique
  ON public.domain_purchases(user_id, lower(domain_name))
  WHERE status IN ('pending', 'purchasing', 'purchased');