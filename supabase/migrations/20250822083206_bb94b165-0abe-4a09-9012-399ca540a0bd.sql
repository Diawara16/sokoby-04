-- Fix critical security vulnerability: Restrict access to user_profiles table
-- This prevents unauthorized access to personal information

-- Create security definer function to get user privacy settings
CREATE OR REPLACE FUNCTION public.get_user_privacy_setting(user_uuid uuid, setting_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT CASE 
    WHEN setting_name = 'show_profile_publicly' THEN COALESCE((
      SELECT show_profile_publicly 
      FROM public.privacy_settings 
      WHERE user_id = user_uuid
    ), false)
    WHEN setting_name = 'show_display_name' THEN COALESCE((
      SELECT show_display_name 
      FROM public.privacy_settings 
      WHERE user_id = user_uuid
    ), false)
    WHEN setting_name = 'show_phone_number' THEN COALESCE((
      SELECT show_phone_number 
      FROM public.privacy_settings 
      WHERE user_id = user_uuid
    ), false)
    WHEN setting_name = 'show_location' THEN COALESCE((
      SELECT show_location 
      FROM public.privacy_settings 
      WHERE user_id = user_uuid
    ), false)
    WHEN setting_name = 'show_date_of_birth' THEN COALESCE((
      SELECT show_date_of_birth 
      FROM public.privacy_settings 
      WHERE user_id = user_uuid
    ), false)
    ELSE false
  END;
$$;

-- Drop existing overly permissive policies on user_profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view public profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Everyone can view profiles" ON public.user_profiles;

-- Create secure RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public profiles with privacy settings"
ON public.user_profiles  
FOR SELECT
USING (
  auth.uid() != user_id AND 
  public.get_user_privacy_setting(user_id, 'show_profile_publicly') = true
);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
ON public.user_profiles
FOR DELETE
USING (auth.uid() = user_id);