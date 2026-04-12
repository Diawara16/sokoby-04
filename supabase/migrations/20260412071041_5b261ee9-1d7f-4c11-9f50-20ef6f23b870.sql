
-- Per-store isolated payment configuration (no shared platform secrets)
CREATE TABLE public.store_payment_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.store_settings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'paypal', 'interac', 'klarna', 'crypto')),
  publishable_key TEXT DEFAULT '',
  encrypted_secret_key TEXT DEFAULT '',
  account_id TEXT DEFAULT '',
  webhook_secret_encrypted TEXT DEFAULT '',
  config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id, provider)
);

-- Enable RLS
ALTER TABLE public.store_payment_configs ENABLE ROW LEVEL SECURITY;

-- Only the store owner can access their own configs
CREATE POLICY "Store owners can view their payment configs"
  ON public.store_payment_configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Store owners can create their payment configs"
  ON public.store_payment_configs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Store owners can update their payment configs"
  ON public.store_payment_configs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Store owners can delete their payment configs"
  ON public.store_payment_configs FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamp
CREATE TRIGGER update_store_payment_configs_updated_at
  BEFORE UPDATE ON public.store_payment_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookup
CREATE INDEX idx_store_payment_configs_store ON public.store_payment_configs(store_id);
CREATE INDEX idx_store_payment_configs_user ON public.store_payment_configs(user_id);
