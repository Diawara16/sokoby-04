
CREATE OR REPLACE FUNCTION public.get_public_store_by_id(_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  store_name text,
  store_description text,
  domain_name text,
  is_custom_domain boolean,
  niche text,
  category text,
  about_text text,
  banner_url text,
  og_image_url text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  default_currency text,
  default_language text,
  social_media jsonb,
  is_production boolean,
  store_status text,
  maintenance_mode boolean
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id, s.user_id, s.store_name, s.store_description, s.domain_name,
         s.is_custom_domain, s.niche, s.category, s.about_text, s.banner_url,
         s.og_image_url, s.seo_title, s.seo_description, s.seo_keywords,
         s.default_currency, s.default_language, s.social_media,
         s.is_production, s.store_status, s.maintenance_mode
  FROM public.store_settings s
  WHERE s.id = _id
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_store_by_id(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_store_by_id(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_domain_taken(_domain text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.store_settings WHERE domain_name = _domain
  );
$$;

REVOKE ALL ON FUNCTION public.is_domain_taken(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_domain_taken(text) TO anon, authenticated;
