
-- 1. Plans table
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_yearly NUMERIC(10,2) NOT NULL DEFAULT 0,
  feature_limits JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are readable by all authenticated users"
  ON public.plans FOR SELECT TO authenticated USING (true);

-- 2. Store subscriptions table
CREATE TABLE public.store_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('active','trial','expired','canceled')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','yearly')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  renewal_date TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Each store can have only one non-canceled subscription
CREATE UNIQUE INDEX store_subscriptions_active_unique
  ON public.store_subscriptions (store_id)
  WHERE status IN ('active','trial');

ALTER TABLE public.store_subscriptions ENABLE ROW LEVEL SECURITY;

-- Store owners can read their own subscription
CREATE POLICY "Store owners can view their subscription"
  ON public.store_subscriptions FOR SELECT TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

-- 3. Subscription events (audit log)
CREATE TABLE public.subscription_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_subscription_id UUID NOT NULL REFERENCES public.store_subscriptions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can view their subscription events"
  ON public.subscription_events FOR SELECT TO authenticated
  USING (
    store_subscription_id IN (
      SELECT ss.id FROM public.store_subscriptions ss
      JOIN public.stores s ON s.id = ss.store_id
      WHERE s.owner_id = auth.uid()
    )
  );

-- 4. Updated_at triggers
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_store_subscriptions_updated_at
  BEFORE UPDATE ON public.store_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Feature gating function
CREATE OR REPLACE FUNCTION public.is_feature_allowed(
  _store_id UUID,
  _feature_key TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT (p.feature_limits->>_feature_key)::boolean
      FROM store_subscriptions ss
      JOIN plans p ON p.id = ss.plan_id
      WHERE ss.store_id = _store_id
        AND ss.status IN ('active','trial')
      LIMIT 1
    ),
    false
  )
$$;

-- 6. Seed default plans
INSERT INTO public.plans (name, slug, description, price_monthly, price_yearly, feature_limits, display_order) VALUES
(
  'Gratuit', 'free', 'Pour découvrir Sokoby',
  0, 0,
  '{"products_limit": 5, "domains_allowed": 0, "staff_accounts": 1, "analytics_access": false, "custom_domain": false, "remove_branding": false, "advanced_analytics": false, "multiple_domains": false}'::jsonb,
  0
),
(
  'Essentiel', 'basic', 'Pour démarrer votre boutique en ligne',
  19, 190,
  '{"products_limit": 20, "domains_allowed": 1, "staff_accounts": 1, "analytics_access": true, "custom_domain": true, "remove_branding": false, "advanced_analytics": false, "multiple_domains": false}'::jsonb,
  1
),
(
  'Pro', 'pro', 'Pour les entreprises en croissance',
  39, 390,
  '{"products_limit": -1, "domains_allowed": 3, "staff_accounts": 5, "analytics_access": true, "custom_domain": true, "remove_branding": true, "advanced_analytics": true, "multiple_domains": true}'::jsonb,
  2
),
(
  'Business', 'business', 'Pour les grandes entreprises',
  119, 1190,
  '{"products_limit": -1, "domains_allowed": -1, "staff_accounts": -1, "analytics_access": true, "custom_domain": true, "remove_branding": true, "advanced_analytics": true, "multiple_domains": true}'::jsonb,
  3
);
