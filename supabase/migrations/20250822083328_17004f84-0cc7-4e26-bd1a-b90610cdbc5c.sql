-- Fix critical security vulnerability: Restrict access to user_profiles table
-- This prevents unauthorized access to personal information

-- Create security definer function to check if a user's profile is public
CREATE OR REPLACE FUNCTION public.is_profile_public(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT profile_visibility = 'public' 
     FROM public.privacy_settings 
     WHERE user_id = user_uuid), 
    false
  );
$$;

-- Drop all existing policies on user_profiles to recreate them securely
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view public profiles only" ON public.user_profiles;

-- Create secure RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public profiles only"
ON public.user_profiles  
FOR SELECT
USING (
  auth.uid() != user_id AND 
  public.is_profile_public(user_id) = true
);

CREATE POLICY "Users can create their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
ON public.user_profiles
FOR DELETE
USING (auth.uid() = user_id);