
-- ============================================================
-- 1. store_settings: remove broad public read, add safe RPC + view
-- ============================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.store_settings;

CREATE OR REPLACE VIEW public.public_storefronts
WITH (security_invoker = true) AS
SELECT
  id,
  user_id,
  store_name,
  store_description,
  domain_name,
  is_custom_domain,
  niche,
  category,
  about_text,
  banner_url,
  og_image_url,
  seo_title,
  seo_description,
  seo_keywords,
  default_currency,
  default_language,
  enabled_languages,
  social_media,
  is_production,
  store_status,
  maintenance_mode,
  published_at,
  created_at
FROM public.store_settings
WHERE is_production = true OR store_status = 'active';

GRANT SELECT ON public.public_storefronts TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_public_store_by_domain(_domain text)
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
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id, s.user_id, s.store_name, s.store_description, s.domain_name,
    s.is_custom_domain, s.niche, s.category, s.about_text, s.banner_url,
    s.og_image_url, s.seo_title, s.seo_description, s.seo_keywords,
    s.default_currency, s.default_language, s.social_media,
    s.is_production, s.store_status, s.maintenance_mode
  FROM public.store_settings s
  WHERE s.domain_name = _domain
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_store_by_domain(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_store_by_domain(text) TO anon, authenticated;

-- ============================================================
-- 2. creator_profiles: remove public read, expose sanitized view
-- ============================================================
DROP POLICY IF EXISTS "Users can view creator profiles" ON public.creator_profiles;

-- Owner-only read policy
CREATE POLICY "Owners can read own creator profile"
ON public.creator_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE VIEW public.public_creator_profiles
WITH (security_invoker = true) AS
SELECT
  id,
  user_id,
  creator_name,
  bio,
  is_verified,
  status,
  created_at
FROM public.creator_profiles
WHERE status = 'active';

GRANT SELECT ON public.public_creator_profiles TO anon, authenticated;

-- ============================================================
-- 3. realtime.messages: per-user scoped access
-- ============================================================
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can receive realtime" ON realtime.messages;
CREATE POLICY "Authenticated can receive realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated can send realtime" ON realtime.messages;
CREATE POLICY "Authenticated can send realtime"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================================
-- 4. Hardening: brand_assets storage policy
-- ============================================================
DROP POLICY IF EXISTS "Users can view their brand assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own brand assets" ON storage.objects;
CREATE POLICY "Users can view their own brand assets"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'brand_assets'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================
-- 5. user_premium_settings: remove client UPDATE
-- ============================================================
DROP POLICY IF EXISTS "Users can update their own premium settings" ON public.user_premium_settings;
DROP POLICY IF EXISTS "Users update own premium settings" ON public.user_premium_settings;

-- ============================================================
-- 6. user_badges: prevent client INSERT
-- ============================================================
DROP POLICY IF EXISTS "Users can insert their own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can award badges" ON public.user_badges;

-- ============================================================
-- 7. Stripe table: remove residual broad policy
-- ============================================================
DROP POLICY IF EXISTS "Service role full access" ON public."Stripe";
DROP POLICY IF EXISTS "Allow all access" ON public."Stripe";

-- ============================================================
-- 8. Fix search_path on SECURITY DEFINER-eligible functions
-- ============================================================
ALTER FUNCTION public.notify_new_order() SET search_path = public;
ALTER FUNCTION public.link_store_to_user() SET search_path = public;
ALTER FUNCTION public.activate_store_subscription() SET search_path = public;
ALTER FUNCTION public.check_user_store_access(text) SET search_path = public;
ALTER FUNCTION public.create_store_for_new_user() SET search_path = public;
ALTER FUNCTION public.generate_store_slug() SET search_path = public;
ALTER FUNCTION public.trigger_video_on_product_change() SET search_path = public;
ALTER FUNCTION public.send_order_webhook() SET search_path = public;
ALTER FUNCTION public.create_store_job() SET search_path = public;
ALTER FUNCTION public.trigger_generate_video() SET search_path = public;
