-- Make user-generated storage buckets private for security
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('review_photos', 'audio-files');

-- Keep brand_assets public as it contains non-sensitive brand materials
-- review_photos and audio-files now require signed URLs

-- Create a security definer function to check group membership without recursion
CREATE OR REPLACE FUNCTION public.user_is_group_member(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_id = group_uuid 
    AND user_id = user_uuid 
    AND status = 'active'
  );
$$;

-- Create a security definer function to check if user is group admin without recursion
CREATE OR REPLACE FUNCTION public.user_is_group_admin(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_id = group_uuid 
    AND user_id = user_uuid 
    AND role = 'admin'
    AND status = 'active'
  );
$$;

-- Replace get_secret function with restricted version
DROP FUNCTION IF EXISTS public.get_secret(text);

CREATE OR REPLACE FUNCTION public.get_public_setting(name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow specific public settings
  IF name IN ('PAYPAL_CLIENT_ID', 'STRIPE_PUBLISHABLE_KEY') THEN
    RETURN current_setting('app.settings.' || name, true);
  END IF;
  
  -- Return null for any other setting
  RETURN NULL;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Update all SECURITY DEFINER functions to have explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, trial_ends_at, last_login)
  VALUES (
    NEW.id, 
    NEW.id,
    NEW.email, 
    now() + interval '14 days',
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    last_login = EXCLUDED.last_login;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_pending_invitations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Accepter automatiquement les invitations en attente pour cet email
  UPDATE public.friend_invitations
  SET status = 'accepted', invited_user_id = NEW.id
  WHERE invited_email = NEW.email AND status = 'pending';
  
  -- Créer les relations d'amitié automatiquement
  INSERT INTO public.friendships (user_id, friend_id, status)
  SELECT inviter_id, NEW.id, 'accepted'
  FROM public.friend_invitations
  WHERE invited_user_id = NEW.id AND status = 'accepted'
  ON CONFLICT (user_id, friend_id) DO NOTHING;
  
  -- Créer la relation inverse
  INSERT INTO public.friendships (user_id, friend_id, status)
  SELECT NEW.id, inviter_id, 'accepted'
  FROM public.friend_invitations
  WHERE invited_user_id = NEW.id AND status = 'accepted'
  ON CONFLICT (user_id, friend_id) DO NOTHING;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.initialize_premium_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.user_premium_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.use_ai_credit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    current_credits INTEGER;
BEGIN
    SELECT ai_credits_remaining INTO current_credits
    FROM public.user_premium_settings
    WHERE user_id = user_uuid;
    
    IF current_credits > 0 THEN
        UPDATE public.user_premium_settings
        SET ai_credits_remaining = ai_credits_remaining - 1,
            updated_at = NOW()
        WHERE user_id = user_uuid;
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_dns_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Mettre à jour le statut des vérifications DNS
  UPDATE dns_monitoring
  SET status = 'pending',
      last_check_time = NOW()
  WHERE last_check_time < NOW() - INTERVAL '1 hour';
  
  -- Insérer une notification pour chaque problème détecté
  INSERT INTO notifications (user_id, title, content)
  SELECT 
    user_id,
    'Problème DNS détecté',
    'Des problèmes ont été détectés avec la configuration DNS de votre domaine.'
  FROM dns_monitoring
  WHERE status = 'error'
  AND updated_at >= NOW() - INTERVAL '5 minutes';
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_minimum_age()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.date_of_birth IS NOT NULL AND 
     (NEW.date_of_birth > CURRENT_DATE - INTERVAL '18 years') THEN
    RAISE EXCEPTION 'Vous devez avoir au moins 18 ans pour créer une boutique';
  END IF;
  
  IF NEW.date_of_birth IS NOT NULL AND 
     (NEW.date_of_birth <= CURRENT_DATE - INTERVAL '18 years') THEN
    NEW.age_verified := true;
  END IF;
  
  RETURN NEW;
END;
$function$;