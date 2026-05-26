UPDATE public.store_videos
SET video_url = 'https://zlwvggnzyfldswpgebij.supabase.co/storage/v1/object/public/store-videos/19f3bf30-8f0b-4d2b-b49d-3aa4cc798c83/video_1779797002569.mp4',
    thumbnail_url = 'https://zlwvggnzyfldswpgebij.supabase.co/storage/v1/object/public/store-videos/19f3bf30-8f0b-4d2b-b49d-3aa4cc798c83/thumb_1779797002569.jpg',
    status = 'ready',
    updated_at = now()
WHERE store_id = '19f3bf30-8f0b-4d2b-b49d-3aa4cc798c83';