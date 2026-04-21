CREATE TABLE public.domain_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  store_id UUID,
  domain_name TEXT NOT NULL,
  tld TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  provider TEXT NOT NULL DEFAULT 'none',
  price_estimate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.domain_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own domain purchases"
ON public.domain_purchases FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users create own domain purchases"
ON public.domain_purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own domain purchases"
ON public.domain_purchases FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own domain purchases"
ON public.domain_purchases FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_domain_purchases_user ON public.domain_purchases(user_id);
CREATE INDEX idx_domain_purchases_domain ON public.domain_purchases(domain_name);