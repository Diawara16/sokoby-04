-- Production patch prerequisites: store niche + realtime theme updates

-- 1) Add niche to store_settings (used end-to-end for AI generation)
ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS niche text;

-- Backfill niche from existing category if present
UPDATE public.store_settings
SET niche = COALESCE(niche, category)
WHERE niche IS NULL AND category IS NOT NULL;

-- 2) Enable realtime for brand_settings so /boutique can live-update theme
ALTER TABLE public.brand_settings REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'brand_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.brand_settings;
  END IF;
END $$;