-- Fix testimonials table security vulnerability
-- Drop the insecure policy that allows public access to all testimonials
DROP POLICY IF EXISTS "Users can view all testimonials" ON public.testimonials;

-- Create a secure policy that only allows store owners to view their own testimonials
CREATE POLICY "Users can view their own testimonials" 
ON public.testimonials 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a function to safely get testimonials for a specific store (for public store pages)
CREATE OR REPLACE FUNCTION public.get_store_testimonials(store_user_id uuid)
RETURNS TABLE(
  id uuid,
  customer_name text,
  customer_photo_url text,
  rating integer,
  message text,
  is_featured boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.customer_name,
    t.customer_photo_url,
    t.rating,
    t.message,
    t.is_featured,
    t.created_at
  FROM public.testimonials t
  WHERE t.user_id = store_user_id
  AND t.is_featured = true
  ORDER BY t.created_at DESC;
END;
$$;