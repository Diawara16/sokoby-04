-- Finalize ALL existing stores as LIVE production stores
UPDATE public.store_settings 
SET 
  is_production = true,
  store_status = 'active',
  production_activated_at = NOW()
WHERE is_production = false OR store_status != 'active';

-- Make ALL products visible and active
UPDATE public.products 
SET is_visible = true
WHERE is_visible = false OR is_visible IS NULL;

-- Make ALL AI-generated products visible
UPDATE public.ai_generated_products 
SET status = 'active'
WHERE status != 'active' OR status IS NULL;