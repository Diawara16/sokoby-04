-- Update the get_store_brand_public function to be more secure and accessible
CREATE OR REPLACE FUNCTION public.get_store_brand_public(store_user_id uuid)
RETURNS TABLE(primary_color text, secondary_color text, logo_url text, slogan text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    bs.primary_color,
    bs.secondary_color,
    bs.logo_url,
    bs.slogan
  FROM public.brand_settings bs
  WHERE bs.user_id = store_user_id;
END;
$function$;

-- Grant execute permissions to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_store_brand_public(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_store_brand_public(uuid) TO authenticated;