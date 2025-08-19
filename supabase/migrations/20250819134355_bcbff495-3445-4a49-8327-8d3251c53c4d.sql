-- Phase B: Add missing theme and order components (avoiding existing policies)

-- Add theme fields to brand_settings if not exists
DO $$
BEGIN
    -- Add theme_template column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_settings' AND column_name = 'theme_template') THEN
        ALTER TABLE brand_settings ADD COLUMN theme_template TEXT DEFAULT 'minimal';
    END IF;
    
    -- Add font_primary column if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_settings' AND column_name = 'font_primary') THEN
        ALTER TABLE brand_settings ADD COLUMN font_primary TEXT DEFAULT 'Inter';
    END IF;
    
    -- Add font_headings column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_settings' AND column_name = 'font_headings') THEN
        ALTER TABLE brand_settings ADD COLUMN font_headings TEXT DEFAULT 'Playfair Display';
    END IF;
    
    -- Add custom_css column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_settings' AND column_name = 'custom_css') THEN
        ALTER TABLE brand_settings ADD COLUMN custom_css TEXT;
    END IF;
    
    -- Add theme_config column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_settings' AND column_name = 'theme_config') THEN
        ALTER TABLE brand_settings ADD COLUMN theme_config JSONB DEFAULT '{}';
    END IF;
END
$$;

-- Create theme_templates table if not exists
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

-- Enable RLS on theme_templates if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'theme_templates' AND rowsecurity = true) THEN
        ALTER TABLE public.theme_templates ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Create theme templates policy if not exists  
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'theme_templates' AND policyname = 'Everyone can view theme templates') THEN
        CREATE POLICY "Everyone can view theme templates" 
        ON public.theme_templates FOR SELECT USING (true);
    END IF;
END
$$;

-- Insert default theme templates if they don't exist
INSERT INTO public.theme_templates (id, name, description, category, config) VALUES
('minimal', 'Minimal', 'Design épuré et moderne, parfait pour les boutiques élégantes', 'business', '{"colors": {"primary": "#000000", "secondary": "#f8f9fa"}, "fonts": {"primary": "Inter", "headings": "Inter"}}'),
('boutique', 'Boutique', 'Design chaleureux pour les boutiques artisanales', 'fashion', '{"colors": {"primary": "#8B4513", "secondary": "#FFF8DC"}, "fonts": {"primary": "Inter", "headings": "Playfair Display"}}'),
('editorial', 'Editorial', 'Style magazine pour les marques de contenu', 'media', '{"colors": {"primary": "#2c3e50", "secondary": "#ecf0f1"}, "fonts": {"primary": "Georgia", "headings": "Playfair Display"}}'),
('bold', 'Bold', 'Design audacieux pour se démarquer', 'creative', '{"colors": {"primary": "#e74c3c", "secondary": "#34495e"}, "fonts": {"primary": "Inter", "headings": "Montserrat"}}'),
('nature', 'Nature', 'Inspiré par la nature, tons verts et organiques', 'organic', '{"colors": {"primary": "#27ae60", "secondary": "#f1c40f"}, "fonts": {"primary": "Inter", "headings": "Merriweather"}}')
ON CONFLICT (id) DO NOTHING;