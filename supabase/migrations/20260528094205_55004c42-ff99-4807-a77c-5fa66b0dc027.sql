
CREATE OR REPLACE FUNCTION public.trigger_video_on_product_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  if not exists (
    select 1 from background_jobs
    where job_type = 'generate_store_video'
    and status in ('pending', 'processing')
    and payload->>'store_id' = NEW.store_id::text
  ) then
    insert into background_jobs (job_type, payload, status)
    values (
      'generate_store_video',
      jsonb_build_object('store_id', NEW.store_id),
      'pending'
    );
  end if;
  return NEW;
end;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_generate_video()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  s_id uuid;
begin
  if (TG_OP = 'DELETE') then
    s_id := OLD.store_id;
  else
    s_id := NEW.store_id;
  end if;

  insert into background_jobs (job_type, payload, status)
  values (
    'generate_store_video',
    jsonb_build_object('store_id', s_id),
    'pending'
  )
  on conflict do nothing;

  return null;
end;
$function$;

CREATE OR REPLACE FUNCTION public.create_store_job()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into background_jobs (job_type, payload, status)
  values (
    'generate_store_video',
    jsonb_build_object('store_id', NEW.id),
    'pending'
  );
  return NEW;
end;
$function$;
