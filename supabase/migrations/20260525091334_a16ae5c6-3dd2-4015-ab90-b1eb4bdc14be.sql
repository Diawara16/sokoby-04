
-- Add payment verification columns to domain_purchases
ALTER TABLE public.domain_purchases
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS amount_paid_cents INTEGER,
  ADD COLUMN IF NOT EXISTS payment_currency TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS uq_domain_purchases_stripe_session
  ON public.domain_purchases (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_domain_purchases_user_created
  ON public.domain_purchases (user_id, created_at DESC);
