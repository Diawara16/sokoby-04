-- First, delete duplicate brand_settings records, keeping the most complete one per user
-- We'll keep the record with the most non-null fields, and if tied, the most recent one

WITH ranked_settings AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id 
      ORDER BY 
        -- Count non-null fields (prioritize completeness)
        (CASE WHEN logo_url IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN primary_color IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN secondary_color IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN slogan IS NOT NULL THEN 1 ELSE 0 END) DESC,
        -- Then by most recent
        updated_at DESC
    ) as rn
  FROM brand_settings
)
DELETE FROM brand_settings
WHERE id IN (
  SELECT id FROM ranked_settings WHERE rn > 1
);

-- Add unique constraint on user_id to prevent future duplicates
ALTER TABLE brand_settings
ADD CONSTRAINT brand_settings_user_id_key UNIQUE (user_id);