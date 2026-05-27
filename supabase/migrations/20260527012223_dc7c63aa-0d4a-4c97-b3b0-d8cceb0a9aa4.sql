
-- Backfill user_id on existing products from their store owner
UPDATE public.products p
SET user_id = s.owner_id
FROM public.stores s
WHERE p.store_id = s.id
  AND p.user_id IS NULL
  AND s.owner_id IS NOT NULL;

-- Add store-owner-based RLS policies so products belonging to a user's store
-- can be updated/deleted/inserted even when user_id is null on the row.
DROP POLICY IF EXISTS "Store owners can update store products" ON public.products;
CREATE POLICY "Store owners can update store products"
ON public.products
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.stores s
    WHERE s.id = products.store_id
      AND s.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stores s
    WHERE s.id = products.store_id
      AND s.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Store owners can delete store products" ON public.products;
CREATE POLICY "Store owners can delete store products"
ON public.products
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.stores s
    WHERE s.id = products.store_id
      AND s.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Store owners can insert store products" ON public.products;
CREATE POLICY "Store owners can insert store products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stores s
    WHERE s.id = products.store_id
      AND s.owner_id = auth.uid()
  )
);
