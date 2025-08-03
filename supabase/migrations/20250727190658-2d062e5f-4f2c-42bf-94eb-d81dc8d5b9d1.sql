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