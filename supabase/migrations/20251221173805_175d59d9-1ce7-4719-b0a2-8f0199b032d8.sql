-- Create the Stripe table that the trigger depends on
CREATE TABLE IF NOT EXISTS public."Stripe" (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  trial_expired BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public."Stripe" ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own Stripe record
CREATE POLICY "Users can view their own Stripe record"
ON public."Stripe"
FOR SELECT
USING (auth.uid() = id);

-- Create policy for users to update their own Stripe record
CREATE POLICY "Users can update their own Stripe record"
ON public."Stripe"
FOR UPDATE
USING (auth.uid() = id);

-- Service role can do everything (for webhooks)
CREATE POLICY "Service role has full access"
ON public."Stripe"
FOR ALL
USING (true)
WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_stripe_updated_at
  BEFORE UPDATE ON public."Stripe"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();