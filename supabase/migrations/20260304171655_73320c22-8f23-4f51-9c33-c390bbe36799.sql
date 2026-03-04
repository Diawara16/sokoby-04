
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS supplier_url text;
