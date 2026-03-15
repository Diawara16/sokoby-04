-- Add notification_type and store_id columns to notifications table
ALTER TABLE public.notifications 
  ADD COLUMN IF NOT EXISTS notification_type text DEFAULT 'info',
  ADD COLUMN IF NOT EXISTS store_id uuid REFERENCES public.store_settings(id) ON DELETE CASCADE;

-- Create index for faster store-based lookups
CREATE INDEX IF NOT EXISTS idx_notifications_store_id ON public.notifications(store_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, read);