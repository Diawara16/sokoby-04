-- Add production_mode column to store_settings to track if store is live
ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS is_production BOOLEAN NOT NULL DEFAULT false;

-- Add production_activated_at to track when store went live
ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS production_activated_at TIMESTAMP WITH TIME ZONE;

-- Add a status field to explicitly track store status
ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS store_status TEXT NOT NULL DEFAULT 'draft' 
CHECK (store_status IN ('draft', 'pending_payment', 'processing', 'active', 'suspended'));

-- Update products table to ensure status field is properly constrained for production
-- First check if status column needs updating
DO $$ 
BEGIN
    -- Add is_visible column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'is_visible' AND table_schema = 'public') THEN
        ALTER TABLE public.products ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;

-- Create index for faster queries on production stores
CREATE INDEX IF NOT EXISTS idx_store_settings_is_production ON public.store_settings(is_production) WHERE is_production = true;
CREATE INDEX IF NOT EXISTS idx_store_settings_store_status ON public.store_settings(store_status);

-- Update all existing demo stores to proper status
UPDATE public.store_settings 
SET store_status = CASE 
    WHEN payment_status = 'completed' AND initial_products_generated = true THEN 'active'
    WHEN payment_status = 'completed' THEN 'processing'
    WHEN payment_status = 'pending' THEN 'pending_payment'
    ELSE 'draft'
END,
is_production = (payment_status = 'completed' AND initial_products_generated = true)
WHERE store_status = 'draft';