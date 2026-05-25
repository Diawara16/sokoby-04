
ALTER TABLE public.ai_generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_dns_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Store owners read ai logs" ON public.ai_generation_logs;
CREATE POLICY "Store owners read ai logs"
  ON public.ai_generation_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.store_settings s WHERE s.id = ai_generation_logs.store_id AND s.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users read own dns records" ON public.domain_dns_records;
CREATE POLICY "Users read own dns records"
  ON public.domain_dns_records FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.domains d WHERE d.id = domain_dns_records.domain_id AND d.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users read own domain orders" ON public.domain_orders;
CREATE POLICY "Users read own domain orders"
  ON public.domain_orders FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users manage own domains" ON public.domains;
CREATE POLICY "Users manage own domains"
  ON public.domains FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners manage marketing content" ON public.marketing_content;
CREATE POLICY "Owners manage marketing content"
  ON public.marketing_content FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.store_settings s WHERE s.id = marketing_content.store_id AND s.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.store_settings s WHERE s.id = marketing_content.store_id AND s.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users read own stripe rows" ON public.stripe;
CREATE POLICY "Users read own stripe rows"
  ON public.stripe FOR SELECT TO authenticated
  USING (customer_email = auth.email());

DROP POLICY IF EXISTS "Service role has full access" ON public."Stripe";

DROP POLICY IF EXISTS "Users can delete their products" ON public.products;
DROP POLICY IF EXISTS "Users can insert products" ON public.products;
DROP POLICY IF EXISTS "Users can update their products" ON public.products;

DROP POLICY IF EXISTS "System can award badges" ON public.user_badges;

DROP POLICY IF EXISTS "Users can leave groups or admins can remove members" ON public.group_members;
CREATE POLICY "Users can leave groups or admins can remove members"
  ON public.group_members FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = public.group_members.group_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'admin'
    )
  );

CREATE OR REPLACE FUNCTION public.is_profile_public(user_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT COALESCE(
    (SELECT profile_visibility = 'public'
     FROM public.privacy_settings
     WHERE user_id = user_uuid),
    false
  );
$function$;

DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent uploader des photos" ON storage.objects;
CREATE POLICY "Users upload own review photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review_photos' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Les utilisateurs peuvent supprimer leurs photos" ON storage.objects;
CREATE POLICY "Users delete own review photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'review_photos' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can upload store videos" ON storage.objects;
CREATE POLICY "Users upload own store videos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'store-videos' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their store videos" ON storage.objects;
CREATE POLICY "Users delete own store videos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'store-videos' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Everyone can view coupons" ON public.coupons;
CREATE POLICY "Authenticated users view coupons"
  ON public.coupons FOR SELECT TO authenticated
  USING (true);

REVOKE SELECT (stream_key) ON public.live_streams FROM anon, authenticated;
CREATE OR REPLACE FUNCTION public.get_my_stream_key(_stream_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $$
  SELECT stream_key FROM public.live_streams
  WHERE id = _stream_id AND streamer_id = auth.uid()
$$;
REVOKE EXECUTE ON FUNCTION public.get_my_stream_key(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_my_stream_key(uuid) TO authenticated;

REVOKE SELECT (shopify_access_token) ON public.migration_requests FROM anon, authenticated;
