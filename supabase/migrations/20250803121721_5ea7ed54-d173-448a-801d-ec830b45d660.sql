-- Étendre la période d'essai pour sabalisabali@outlook.fr
UPDATE public.profiles 
SET trial_ends_at = NOW() + INTERVAL '14 days',
    updated_at = NOW()
WHERE email = 'sabalisabali@outlook.fr';

-- Optionnel: Créer un abonnement actif si nécessaire
-- (commenté pour l'instant, peut être activé selon les besoins)
/*
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Récupérer l'ID de l'utilisateur
    SELECT id INTO user_uuid 
    FROM public.profiles 
    WHERE email = 'sabalisabali@outlook.fr';
    
    -- Créer un abonnement actif
    IF user_uuid IS NOT NULL THEN
        INSERT INTO public.subscriptions (
            user_id,
            status,
            current_period_start,
            current_period_end,
            created_at,
            updated_at
        ) VALUES (
            user_uuid,
            'active',
            NOW(),
            NOW() + INTERVAL '1 month',
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            status = 'active',
            current_period_start = NOW(),
            current_period_end = NOW() + INTERVAL '1 month',
            updated_at = NOW();
        
        RAISE NOTICE 'Abonnement créé/mis à jour pour l''utilisateur: %', user_uuid;
    END IF;
END $$;
*/