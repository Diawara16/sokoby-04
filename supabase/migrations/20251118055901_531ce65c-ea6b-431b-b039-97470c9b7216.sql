-- Add new columns to store_settings for dual store creation flow
ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS store_type TEXT CHECK (store_type IN ('manual', 'ai')) DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS initial_products_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT;

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_store_settings_store_type ON public.store_settings(store_type);
CREATE INDEX IF NOT EXISTS idx_store_settings_payment_status ON public.store_settings(payment_status);
CREATE INDEX IF NOT EXISTS idx_store_settings_trial_end_date ON public.store_settings(trial_end_date);