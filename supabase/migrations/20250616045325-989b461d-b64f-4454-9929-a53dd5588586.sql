
-- Table pour stocker les demandes de migration
CREATE TABLE public.migration_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  source_platform TEXT NOT NULL DEFAULT 'shopify',
  shopify_store_url TEXT,
  shopify_access_token TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  store_size TEXT, -- 'small', 'medium', 'large'
  migration_type JSONB DEFAULT '{"products": true, "customers": true, "orders": true}',
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'normal',
  notes TEXT,
  estimated_completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour suivre les étapes de migration
CREATE TABLE public.migration_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  migration_request_id UUID REFERENCES public.migration_requests NOT NULL,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  data_migrated JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour stocker les données migrées temporairement
CREATE TABLE public.migration_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  migration_request_id UUID REFERENCES public.migration_requests NOT NULL,
  data_type TEXT NOT NULL, -- 'products', 'customers', 'orders'
  source_id TEXT NOT NULL,
  source_data JSONB NOT NULL,
  mapped_data JSONB,
  migrated_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.migration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_data ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour migration_requests
CREATE POLICY "Users can view their own migration requests" 
  ON public.migration_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own migration requests" 
  ON public.migration_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own migration requests" 
  ON public.migration_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politiques RLS pour migration_steps
CREATE POLICY "Users can view migration steps for their requests" 
  ON public.migration_steps 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.migration_requests 
      WHERE id = migration_steps.migration_request_id 
      AND user_id = auth.uid()
    )
  );

-- Politiques RLS pour migration_data
CREATE POLICY "Users can view migration data for their requests" 
  ON public.migration_data 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.migration_requests 
      WHERE id = migration_data.migration_request_id 
      AND user_id = auth.uid()
    )
  );

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_migration_requests_updated_at
  BEFORE UPDATE ON public.migration_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_migration_steps_updated_at
  BEFORE UPDATE ON public.migration_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_migration_data_updated_at
  BEFORE UPDATE ON public.migration_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour optimiser les performances
CREATE INDEX idx_migration_requests_user_id ON public.migration_requests(user_id);
CREATE INDEX idx_migration_requests_status ON public.migration_requests(status);
CREATE INDEX idx_migration_steps_request_id ON public.migration_steps(migration_request_id);
CREATE INDEX idx_migration_data_request_id ON public.migration_data(migration_request_id);
