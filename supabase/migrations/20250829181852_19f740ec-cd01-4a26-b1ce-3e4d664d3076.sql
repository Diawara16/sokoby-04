-- Create domain_verifications table for domain verification tracking
CREATE TABLE IF NOT EXISTS public.domain_verifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_name text NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  verified boolean DEFAULT false,
  verified_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.domain_verifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public can SELECT verified domains (needed for DomainRouter)
CREATE POLICY "Public can view verified domains" 
ON public.domain_verifications 
FOR SELECT 
USING (verified = true);

-- Users can view their own domain verifications
CREATE POLICY "Users can view their own domain verifications" 
ON public.domain_verifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own domain verifications
CREATE POLICY "Users can create domain verifications" 
ON public.domain_verifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own domain verifications
CREATE POLICY "Users can update their own domain verifications" 
ON public.domain_verifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index on domain_name for performance
CREATE INDEX IF NOT EXISTS idx_domain_verifications_domain_name ON public.domain_verifications(domain_name);

-- Create trigger for updated_at
CREATE TRIGGER update_domain_verifications_updated_at
  BEFORE UPDATE ON public.domain_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();