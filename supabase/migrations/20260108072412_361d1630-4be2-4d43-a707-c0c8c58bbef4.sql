-- BACKFILL MIGRATION: Fix existing products for LIVE storefronts
-- 1. Set store_id for products where user has a production store but product lacks store_id
-- 2. Set LIVE flags (is_visible, published, status) for production store products
-- 3. Backfill missing images with deterministic placeholders

-- Step 1: Link products to their owner's production store where store_id is missing
UPDATE products p
SET store_id = ss.id
FROM store_settings ss
WHERE p.user_id = ss.user_id
  AND p.store_id IS NULL
  AND ss.is_production = true;

-- Step 2: Set LIVE flags for all products belonging to production stores
UPDATE products p
SET 
  is_visible = true,
  published = true,
  status = 'active'
FROM store_settings ss
WHERE p.store_id = ss.id
  AND ss.is_production = true
  AND (p.is_visible IS NOT true OR p.published IS NOT true OR p.status != 'active');

-- Step 3: Backfill missing images with deterministic placeholders based on category
UPDATE products
SET image = CASE 
  WHEN LOWER(category) LIKE '%fashion%' OR LOWER(category) LIKE '%clothing%' OR LOWER(category) LIKE '%vetement%' 
    THEN 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&q=80'
  WHEN LOWER(category) LIKE '%electron%' OR LOWER(category) LIKE '%tech%' OR LOWER(category) LIKE '%gadget%'
    THEN 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&q=80'
  WHEN LOWER(category) LIKE '%beauty%' OR LOWER(category) LIKE '%cosmetic%' OR LOWER(category) LIKE '%beaute%'
    THEN 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80'
  WHEN LOWER(category) LIKE '%home%' OR LOWER(category) LIKE '%maison%' OR LOWER(category) LIKE '%decor%'
    THEN 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80'
  WHEN LOWER(category) LIKE '%sport%' OR LOWER(category) LIKE '%fitness%'
    THEN 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&q=80'
  ELSE 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop&q=80'
END
WHERE image IS NULL 
  AND store_id IN (SELECT id FROM store_settings WHERE is_production = true);