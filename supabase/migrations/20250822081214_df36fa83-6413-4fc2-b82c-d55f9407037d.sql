-- Enable Row Level Security on tables that have policies but RLS disabled
-- This is a critical security fix

-- Enable RLS on marketplace_webhooks table
ALTER TABLE public.marketplace_webhooks ENABLE ROW LEVEL SECURITY;

-- Enable RLS on returns table  
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;