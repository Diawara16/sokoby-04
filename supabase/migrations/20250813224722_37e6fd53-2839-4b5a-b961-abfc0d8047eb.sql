-- Activer RLS sur les tables manquantes (problèmes détectés par le linter)
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- Créer les politiques manquantes pour store_settings si elles n'existent pas
DO $$ 
BEGIN
    -- Vérifier si les politiques existent déjà
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'store_settings' 
        AND policyname = 'Users can manage their own store settings'
    ) THEN
        -- Créer les politiques pour store_settings
        CREATE POLICY "Users can manage their own store settings" 
        ON public.store_settings 
        FOR ALL 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Créer les politiques pour user_challenge_progress si elles n'existent pas
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_challenge_progress' 
        AND policyname = 'Users can manage their own challenge progress'
    ) THEN
        CREATE POLICY "Users can manage their own challenge progress" 
        ON public.user_challenge_progress 
        FOR ALL 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Vérifier et corriger les politiques de stockage pour brand_assets
-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can upload their own brand assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own brand assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own brand assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own brand assets" ON storage.objects;

-- Créer les nouvelles politiques pour le bucket brand_assets
CREATE POLICY "Users can upload their own brand assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'brand_assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own brand assets" 
ON storage.objects 
FOR SELECT 
USING (
    bucket_id = 'brand_assets' 
    AND (
        auth.uid()::text = (storage.foldername(name))[1]
        OR bucket_id = 'brand_assets' -- Permettre la lecture publique pour brand_assets
    )
);

CREATE POLICY "Users can update their own brand assets" 
ON storage.objects 
FOR UPDATE 
USING (
    bucket_id = 'brand_assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own brand assets" 
ON storage.objects 
FOR DELETE 
USING (
    bucket_id = 'brand_assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- S'assurer que le bucket brand_assets est public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'brand_assets';