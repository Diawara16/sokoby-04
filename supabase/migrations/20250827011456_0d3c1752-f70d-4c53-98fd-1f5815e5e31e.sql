-- Create a public RPC function to get brand settings for store previews
CREATE OR REPLACE FUNCTION public.get_store_brand_public(store_user_id uuid)
RETURNS TABLE(
  primary_color text,
  secondary_color text,
  logo_url text,
  slogan text
) 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
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
$$;