-- Corriger la table products pour supporter les boutiques utilisateur
-- Ajouter les colonnes manquantes à la table products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock integer DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Activer RLS sur products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can create their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

-- Créer les politiques RLS pour products
CREATE POLICY "Users can view their own products" ON public.products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON public.products
  FOR DELETE USING (auth.uid() = user_id);

-- Corriger les autres tables critiques identifiées par le linter
-- Activer RLS sur les tables manquantes
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Ajouter des politiques pour store_settings si elles manquent
DROP POLICY IF EXISTS "Users can view their own store settings" ON public.store_settings;
DROP POLICY IF EXISTS "Users can update their own store settings" ON public.store_settings;
DROP POLICY IF EXISTS "Users can insert their own store settings" ON public.store_settings;

CREATE POLICY "Users can view their own store settings" ON public.store_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own store settings" ON public.store_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own store settings" ON public.store_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ajouter des politiques pour notifications si elles manquent
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);