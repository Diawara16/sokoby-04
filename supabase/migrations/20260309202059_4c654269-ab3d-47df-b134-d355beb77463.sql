-- RLS policy for stores: users can read their own stores
CREATE POLICY "Users can read own stores" ON public.stores FOR SELECT TO authenticated USING (
  owner_id = auth.uid() OR user_id = auth.uid()
);

-- Users can update their own stores
CREATE POLICY "Users can update own stores" ON public.stores FOR UPDATE TO authenticated USING (
  owner_id = auth.uid() OR user_id = auth.uid()
);