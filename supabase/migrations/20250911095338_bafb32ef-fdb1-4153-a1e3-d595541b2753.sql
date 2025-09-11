-- Add missing columns to store_settings for enhanced customization
ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS about_text TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS enabled_languages TEXT[] DEFAULT ARRAY['fr']::TEXT[];

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_photo_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for testimonials
CREATE POLICY "Users can view all testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Users can manage their own testimonials" ON public.testimonials FOR ALL USING (auth.uid() = user_id);

-- Create FAQ table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for faqs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for FAQs
CREATE POLICY "Users can view active FAQs" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage their own FAQs" ON public.faqs FOR ALL USING (auth.uid() = user_id);

-- Create footer links table
CREATE TABLE public.footer_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'custom',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for footer links
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for footer links
CREATE POLICY "Users can view active footer links" ON public.footer_links FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage their own footer links" ON public.footer_links FOR ALL USING (auth.uid() = user_id);

-- Create store policies table for FAQ/Delivery/Payment content
CREATE TABLE public.store_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  policy_type TEXT NOT NULL, -- 'faq', 'delivery', 'payment', 'security'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, policy_type)
);

-- Enable RLS for store policies
ALTER TABLE public.store_policies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for store policies
CREATE POLICY "Users can view active store policies" ON public.store_policies FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage their own store policies" ON public.store_policies FOR ALL USING (auth.uid() = user_id);

-- Add triggers for updating timestamps
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_footer_links_updated_at
    BEFORE UPDATE ON public.footer_links
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_policies_updated_at
    BEFORE UPDATE ON public.store_policies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();