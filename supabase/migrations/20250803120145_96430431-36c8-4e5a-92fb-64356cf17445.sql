-- Créer le profil pour l'utilisateur diawarasoninke@outlook.fr
-- D'abord, récupérer l'ID de l'utilisateur
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Chercher l'utilisateur dans auth.users
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'diawarasoninke@outlook.fr';
    
    -- Si l'utilisateur existe, créer son profil
    IF user_uuid IS NOT NULL THEN
        -- Insérer le profil avec période d'essai de 14 jours
        INSERT INTO public.profiles (
            id, 
            email, 
            trial_ends_at, 
            features_usage, 
            last_login
        ) VALUES (
            user_uuid,
            'diawarasoninke@outlook.fr',
            NOW() + INTERVAL '14 days',
            '{}',
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            trial_ends_at = NOW() + INTERVAL '14 days',
            last_login = NOW();
        
        RAISE NOTICE 'Profil créé/mis à jour pour l''utilisateur: %', user_uuid;
    ELSE
        RAISE NOTICE 'Utilisateur avec email diawarasoninke@outlook.fr non trouvé';
    END IF;
END $$;