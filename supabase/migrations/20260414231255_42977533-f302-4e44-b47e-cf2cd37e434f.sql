
-- Ensure domain_name is globally unique across the domains table
-- This prevents a domain from being attached to multiple stores
CREATE UNIQUE INDEX IF NOT EXISTS domains_domain_name_unique 
  ON public.domains (domain_name) 
  WHERE domain_name IS NOT NULL;

-- Index for fast status-based queries (re-verification of active domains)
CREATE INDEX IF NOT EXISTS domains_status_idx ON public.domains (status);

-- Index for store-scoped lookups
CREATE INDEX IF NOT EXISTS domains_store_id_idx ON public.domains (store_id) WHERE store_id IS NOT NULL;

-- Ensure store_domains also has global uniqueness on domain (not just per-store)
CREATE UNIQUE INDEX IF NOT EXISTS store_domains_domain_unique 
  ON public.store_domains (domain) 
  WHERE domain IS NOT NULL;
