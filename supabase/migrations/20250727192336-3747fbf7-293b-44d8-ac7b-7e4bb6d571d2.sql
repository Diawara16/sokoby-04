-- Add missing columns to store_settings table for manual store creation
ALTER TABLE public.store_settings 
ADD COLUMN store_description TEXT,
ADD COLUMN category TEXT;