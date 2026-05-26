
-- Reset broken Storing store video and re-enqueue generation
UPDATE public.store_videos
SET status = 'pending', video_url = '', thumbnail_url = NULL, updated_at = now()
WHERE store_id = '19f3bf30-8f0b-4d2b-b49d-3aa4cc798c83'
  AND video_url LIKE '%backblazeb2%';

INSERT INTO public.background_jobs (job_type, status, payload, created_at, updated_at)
VALUES ('generate_store_video', 'pending', jsonb_build_object('store_id', '19f3bf30-8f0b-4d2b-b49d-3aa4cc798c83'), now(), now());
