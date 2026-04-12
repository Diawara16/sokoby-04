-- Add missing columns for advanced settings persistence
ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS seo_keywords text,
  ADD COLUMN IF NOT EXISTS analytics_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS ga_tracking_id text,
  ADD COLUMN IF NOT EXISTS cookie_consent_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS maintenance_mode boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS custom_css text,
  ADD COLUMN IF NOT EXISTS custom_js text,
  ADD COLUMN IF NOT EXISTS payment_settings jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS shipping_settings jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS published_at timestamp with time zone;