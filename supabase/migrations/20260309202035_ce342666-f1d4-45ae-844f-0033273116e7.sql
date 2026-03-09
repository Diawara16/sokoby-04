-- Add missing columns to stores table for plan-based access control
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS owner_email text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS billing_status text DEFAULT 'inactive';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON public.stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_owner_email ON public.stores(owner_email);
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON public.stores(owner_id);