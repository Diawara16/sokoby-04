-- Enable RLS on missing tables
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_webhooks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for returns table
CREATE POLICY "Users can view their own returns" 
ON public.returns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own returns" 
ON public.returns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own returns" 
ON public.returns 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for marketplace_webhooks table
CREATE POLICY "Users can view their own marketplace webhooks" 
ON public.marketplace_webhooks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own marketplace webhooks" 
ON public.marketplace_webhooks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketplace webhooks" 
ON public.marketplace_webhooks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Fix database functions security by adding search_path protection
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_minimum_age()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.get_secret(name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN current_setting('app.settings.' || name);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_pending_invitations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
  WHERE invited_user_id = NEW.id AND status = 'accepted
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
SET search_path = ''
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
SET search_path = ''
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