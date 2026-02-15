
-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  store_name TEXT NOT NULL,
  niche TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stores"
  ON public.stores FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own stores"
  ON public.stores FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own stores"
  ON public.stores FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own stores"
  ON public.stores FOR DELETE
  USING (auth.uid() = owner_id);

CREATE POLICY "Service role full access on stores"
  ON public.stores FOR ALL
  USING (auth.role() = 'service_role');

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create master_products table (product catalog by niche)
CREATE TABLE public.master_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT,
  niche TEXT NOT NULL,
  category TEXT,
  supplier TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.master_products ENABLE ROW LEVEL SECURITY;

-- Master products are readable by authenticated users
CREATE POLICY "Authenticated users can read master_products"
  ON public.master_products FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role full access on master_products"
  ON public.master_products FOR ALL
  USING (auth.role() = 'service_role');
