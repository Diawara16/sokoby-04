import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { StoreSettings } from "../types";

export const useActiveStore = () => {
  const { toast } = useToast();
  const [store, setStore] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchStore = useCallback(async (isRetry = false) => {
    try {
      setHasError(false);
      if (!isRetry) setIsLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        setStore(null);
        setIsLoading(false);
        return;
      }

      // Try stores table first (primary)
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user.id)
        .limit(1)
        .maybeSingle();

      if (storeError) throw storeError;

      if (storeData) {
        setStore(storeData as unknown as StoreSettings);
        setIsLoading(false);
        return;
      }

      // Fallback: check store_settings (AI-generated stores)
      const { data: settingsData, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (settingsError) throw settingsError;

      if (settingsData) {
        setStore(settingsData as unknown as StoreSettings);
        setIsLoading(false);
        return;
      }

      // No store found — retry once if first attempt
      if (!isRetry) {
        await new Promise(r => setTimeout(r, 1000));
        await fetchStore(true);
        return;
      }

      setStore(null);
    } catch (err) {
      console.error('Erreur récupération boutique active:', err);
      setHasError(true);
      if (!isRetry) {
        // Auto-retry once on error
        await new Promise(r => setTimeout(r, 1500));
        await fetchStore(true);
        return;
      }
      toast({
        title: "Erreur",
        description: "Impossible de charger votre boutique active",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  return { store, isLoading, hasError, refetch: () => fetchStore(false) };
};
