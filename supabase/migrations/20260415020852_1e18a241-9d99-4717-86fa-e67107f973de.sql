CREATE OR REPLACE FUNCTION public.is_feature_allowed(_store_id uuid, _feature_key text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE(
    (
      SELECT (p.feature_limits->>_feature_key)::boolean
      FROM store_subscriptions ss
      JOIN plans p ON p.id = ss.plan_id
      WHERE ss.store_id = _store_id
        AND ss.status IN ('active','trial','canceling')
      LIMIT 1
    ),
    false
  )
$function$;