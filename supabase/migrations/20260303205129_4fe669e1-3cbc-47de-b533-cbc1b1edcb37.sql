
-- 1. Store Themes
CREATE TABLE public.store_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  preview_image_url text,
  layout_config jsonb NOT NULL DEFAULT '{}',
  color_palette jsonb DEFAULT '{}',
  typography jsonb DEFAULT '{}',
  is_default boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store themes are publicly readable"
  ON public.store_themes FOR SELECT USING (true);

-- 2. Store Theme Assignments
CREATE TABLE public.store_theme_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.store_settings(id) ON DELETE CASCADE,
  theme_id uuid NOT NULL REFERENCES public.store_themes(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  custom_overrides jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (store_id, theme_id)
);

ALTER TABLE public.store_theme_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own theme assignments"
  ON public.store_theme_assignments FOR SELECT
  USING (store_id IN (SELECT id FROM public.store_settings WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own theme assignments"
  ON public.store_theme_assignments FOR ALL
  USING (store_id IN (SELECT id FROM public.store_settings WHERE user_id = auth.uid()));

CREATE POLICY "Public can read active theme assignments"
  ON public.store_theme_assignments FOR SELECT
  USING (is_active = true);

-- 3. Pages
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.store_settings(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  is_published boolean DEFAULT true,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (store_id, slug)
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can manage their pages"
  ON public.pages FOR ALL
  USING (store_id IN (SELECT id FROM public.store_settings WHERE user_id = auth.uid()));

CREATE POLICY "Published pages are publicly readable"
  ON public.pages FOR SELECT
  USING (is_published = true);

-- 4. Sections
CREATE TABLE public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_type text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  config jsonb NOT NULL DEFAULT '{}',
  is_visible boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sections inherit page access for owners"
  ON public.sections FOR ALL
  USING (page_id IN (
    SELECT p.id FROM public.pages p
    JOIN public.store_settings ss ON ss.id = p.store_id
    WHERE ss.user_id = auth.uid()
  ));

CREATE POLICY "Visible sections on published pages are public"
  ON public.sections FOR SELECT
  USING (is_visible = true AND page_id IN (
    SELECT id FROM public.pages WHERE is_published = true
  ));

-- Triggers for updated_at
CREATE TRIGGER update_store_themes_updated_at
  BEFORE UPDATE ON public.store_themes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_store_theme_assignments_updated_at
  BEFORE UPDATE ON public.store_theme_assignments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
