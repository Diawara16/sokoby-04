-- ============================================
-- COMPREHENSIVE SECURITY FIXES (CORRECTED)
-- Addresses all error-level security findings
-- ============================================

-- ============================================
-- 1. FIX SECURITY DEFINER FUNCTIONS - Add search_path
-- ============================================

-- User account and profile functions
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, trial_ends_at, last_login)
  VALUES (
    NEW.id, 
    NEW.id,
    NEW.email, 
    now() + interval '14 days',
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    last_login = EXCLUDED.last_login;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.process_pending_invitations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.friend_invitations
  SET status = 'accepted', invited_user_id = NEW.id
  WHERE invited_email = NEW.email AND status = 'pending';
  
  INSERT INTO public.friendships (user_id, friend_id, status)
  SELECT inviter_id, NEW.id, 'accepted'
  FROM public.friend_invitations
  WHERE invited_user_id = NEW.id AND status = 'accepted'
  ON CONFLICT (user_id, friend_id) DO NOTHING;
  
  INSERT INTO public.friendships (user_id, friend_id, status)
  SELECT NEW.id, inviter_id, 'accepted'
  FROM public.friend_invitations
  WHERE invited_user_id = NEW.id AND status = 'accepted'
  ON CONFLICT (user_id, friend_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_user_sanctions(user_uuid uuid)
RETURNS TABLE(is_banned boolean, is_suspended boolean, ban_expires_at timestamp with time zone, suspend_expires_at timestamp with time zone, active_sanctions text[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(bool_or(sanction_type = 'ban' AND is_active AND (expires_at IS NULL OR expires_at > now())), false) as is_banned,
    COALESCE(bool_or(sanction_type = 'suspend' AND is_active AND (expires_at IS NULL OR expires_at > now())), false) as is_suspended,
    MAX(CASE WHEN sanction_type = 'ban' AND is_active THEN expires_at END) as ban_expires_at,
    MAX(CASE WHEN sanction_type = 'suspend' AND is_active THEN expires_at END) as suspend_expires_at,
    COALESCE(array_agg(sanction_type || ': ' || reason) FILTER (WHERE is_active AND (expires_at IS NULL OR expires_at > now())), ARRAY[]::TEXT[]) as active_sanctions
  FROM public.user_sanctions
  WHERE user_id = user_uuid;
END;
$$;

-- Financial and credits functions
CREATE OR REPLACE FUNCTION public.use_ai_credit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    SELECT ai_credits_remaining INTO current_credits
    FROM public.user_premium_settings
    WHERE user_id = user_uuid;
    
    IF current_credits > 0 THEN
        UPDATE public.user_premium_settings
        SET ai_credits_remaining = ai_credits_remaining - 1,
            updated_at = NOW()
        WHERE user_id = user_uuid;
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.award_loyalty_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    points_to_award INTEGER;
BEGIN
    points_to_award := FLOOR(NEW.total_amount);
    
    INSERT INTO public.loyalty_points (user_id, points, lifetime_points)
    VALUES (NEW.user_id, points_to_award, points_to_award)
    ON CONFLICT (user_id) DO UPDATE
    SET 
        points = loyalty_points.points + points_to_award,
        lifetime_points = loyalty_points.lifetime_points + points_to_award;

    INSERT INTO public.loyalty_points_history (
        user_id,
        points_change,
        reason,
        order_id
    ) VALUES (
        NEW.user_id,
        points_to_award,
        'Commande #' || substring(NEW.id::text, 1, 8),
        NEW.id
    );

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.award_referral_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.loyalty_points_history (user_id, points_change, reason)
  VALUES (NEW.referrer_id, 500, 'Parrainage converti');
  
  UPDATE public.loyalty_points
  SET points = points + 500, lifetime_points = lifetime_points + 500
  WHERE user_id = NEW.referrer_id;

  INSERT INTO public.loyalty_points_history (user_id, points_change, reason)
  VALUES (NEW.referred_id, 200, 'Inscription via parrainage');
  
  INSERT INTO public.loyalty_points (user_id, points, lifetime_points)
  VALUES (NEW.referred_id, 200, 200)
  ON CONFLICT (user_id) DO UPDATE
  SET points = loyalty_points.points + 200, lifetime_points = loyalty_points.lifetime_points + 200;

  RETURN NEW;
END;
$$;

-- Notification and utility functions
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations SET last_message_at = NEW.created_at, updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_dns_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.dns_monitoring SET status = 'pending', last_check_time = NOW()
  WHERE last_check_time < NOW() - INTERVAL '1 hour';
  
  INSERT INTO public.notifications (user_id, title, content)
  SELECT user_id, 'Problème DNS détecté', 'Des problèmes ont été détectés avec la configuration DNS de votre domaine.'
  FROM public.dns_monitoring WHERE status = 'error' AND updated_at >= NOW() - INTERVAL '5 minutes';
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS NULL OR NEW.status != OLD.status THEN
    INSERT INTO public.notifications (user_id, title, content)
    VALUES (NEW.user_id,
      CASE NEW.status
        WHEN 'processing' THEN 'Commande en cours de traitement'
        WHEN 'completed' THEN 'Commande complétée'
        WHEN 'cancelled' THEN 'Commande annulée'
        WHEN 'refunded' THEN 'Commande remboursée'
        ELSE 'Mise à jour de la commande'
      END,
      CASE NEW.status
        WHEN 'processing' THEN 'Votre commande #' || substring(NEW.id::text, 1, 8) || ' est en cours de traitement.'
        WHEN 'completed' THEN 'Votre commande #' || substring(NEW.id::text, 1, 8) || ' a été complétée avec succès.'
        WHEN 'cancelled' THEN 'Votre commande #' || substring(NEW.id::text, 1, 8) || ' a été annulée.'
        WHEN 'refunded' THEN 'Votre commande #' || substring(NEW.id::text, 1, 8) || ' a été remboursée.'
        ELSE 'Le statut de votre commande #' || substring(NEW.id::text, 1, 8) || ' a été mis à jour.'
      END
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_loyalty_tier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.current_tier := 
        CASE 
            WHEN NEW.lifetime_points >= 10000 THEN 'diamond'
            WHEN NEW.lifetime_points >= 5000 THEN 'gold'
            WHEN NEW.lifetime_points >= 1000 THEN 'silver'
            ELSE 'bronze'
        END;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.initialize_premium_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_premium_settings (user_id)
    VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.initialize_privacy_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.privacy_settings (user_id)
    VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.subscriptions SET status = 'expired'
  WHERE current_period_end < now() AND status = 'active';
  
  INSERT INTO public.notifications (user_id, title, content)
  SELECT user_id, 'Abonnement expiré', 'Votre abonnement a expiré. Veuillez le renouveler pour continuer à utiliser nos services.'
  FROM public.subscriptions WHERE current_period_end < now() AND status = 'active';
END;
$$;

CREATE OR REPLACE FUNCTION public.update_flash_sales_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.flash_sales SET status = 'active'
  WHERE status = 'scheduled' AND start_time <= NOW() AND end_time > NOW();

  UPDATE public.flash_sales SET status = 'ended'
  WHERE status = 'active' AND end_time <= NOW();

  INSERT INTO public.notifications (user_id, title, content)
  SELECT fs.user_id, 'Nouvelle vente flash active', 'Votre vente flash pour le produit est maintenant active.'
  FROM public.flash_sales fs WHERE status = 'active' AND updated_at >= NOW() - INTERVAL '1 minute';
END;
$$;

-- ============================================
-- 2. CREATE SERVER-SIDE TRIAL VALIDATION
-- ============================================

CREATE OR REPLACE FUNCTION public.check_user_access(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_active_sub boolean;
  trial_active boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = user_uuid AND status = 'active' AND current_period_end > now()
  ) INTO has_active_sub;
  
  SELECT trial_ends_at > now() 
  FROM public.profiles WHERE user_id = user_uuid
  INTO trial_active;
  
  RETURN has_active_sub OR COALESCE(trial_active, false);
END;
$$;

-- ============================================
-- 3. STRENGTHEN PROFILES RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

CREATE POLICY "Block anonymous access to profiles"
ON public.profiles FOR ALL TO anon USING (false);

CREATE POLICY "Authenticated users view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. ENSURE CUSTOMER_DETAILS HAS PROPER RLS
-- ============================================

ALTER TABLE IF EXISTS public.customer_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view customers" ON public.customer_details;
DROP POLICY IF EXISTS "Public can view customers" ON public.customer_details;