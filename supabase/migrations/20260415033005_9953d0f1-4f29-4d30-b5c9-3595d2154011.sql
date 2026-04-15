-- Add stripe_event_id for idempotency checks
ALTER TABLE public.subscription_events 
ADD COLUMN IF NOT EXISTS stripe_event_id text;

-- Unique index to enforce idempotency
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscription_events_stripe_event_id 
ON public.subscription_events (stripe_event_id) 
WHERE stripe_event_id IS NOT NULL;