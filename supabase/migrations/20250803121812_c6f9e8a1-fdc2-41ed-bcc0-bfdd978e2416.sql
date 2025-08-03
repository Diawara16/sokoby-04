-- Étendre la période d'essai pour sabalisabali@outlook.fr
UPDATE public.profiles 
SET trial_ends_at = NOW() + INTERVAL '14 days'
WHERE email = 'sabalisabali@outlook.fr';