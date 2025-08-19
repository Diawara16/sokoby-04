-- Phase B: Theme System and Real Orders
-- Add theme fields to brand_settings
ALTER TABLE brand_settings 
ADD COLUMN IF NOT EXISTS theme_template TEXT DEFAULT 'minimal',
ADD COLUMN IF NOT EXISTS font_primary TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS font_headings TEXT DEFAULT 'Playfair Display',
ADD COLUMN IF NOT EXISTS custom_css TEXT,
ADD COLUMN IF NOT EXISTS theme_config JSONB DEFAULT '{}';

-- Create orders table for real checkout
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  store_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time DECIMAL(10,2) NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create theme_templates table for professional themes
CREATE TABLE IF NOT EXISTS public.theme_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  category TEXT NOT NULL DEFAULT 'business',
  is_premium BOOLEAN DEFAULT false,
  config JSONB NOT NULL DEFAULT '{}',
  css_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_templates ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders for their stores" 
ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies  
CREATE POLICY "Users can view order items for their orders" 
ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can insert order items for their orders" 
ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Theme templates policies
CREATE POLICY "Everyone can view theme templates" 
ON public.theme_templates FOR SELECT USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);  
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Add triggers for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default theme templates
INSERT INTO public.theme_templates (id, name, description, category, config) VALUES
('minimal', 'Minimal', 'Design épuré et moderne, parfait pour les boutiques élégantes', 'business', '{"colors": {"primary": "#000000", "secondary": "#f8f9fa"}, "fonts": {"primary": "Inter", "headings": "Inter"}}'),
('boutique', 'Boutique', 'Design chaleureux pour les boutiques artisanales', 'fashion', '{"colors": {"primary": "#8B4513", "secondary": "#FFF8DC"}, "fonts": {"primary": "Inter", "headings": "Playfair Display"}}'),
('editorial', 'Editorial', 'Style magazine pour les marques de contenu', 'media', '{"colors": {"primary": "#2c3e50", "secondary": "#ecf0f1"}, "fonts": {"primary": "Georgia", "headings": "Playfair Display"}}'),
('bold', 'Bold', 'Design audacieux pour se démarquer', 'creative', '{"colors": {"primary": "#e74c3c", "secondary": "#34495e"}, "fonts": {"primary": "Inter", "headings": "Montserrat"}}'),
('nature', 'Nature', 'Inspiré par la nature, tons verts et organiques', 'organic', '{"colors": {"primary": "#27ae60", "secondary": "#f1c40f"}, "fonts": {"primary": "Inter", "headings": "Merriweather"}}')
ON CONFLICT (id) DO NOTHING;