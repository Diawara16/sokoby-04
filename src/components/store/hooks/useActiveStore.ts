import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { StoreSettings } from "../types";

export const useActiveStore = () => {
  const { toast } = useToast();
  const [store, setStore] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStore = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          setStore(null);
          return;
        }

        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('owner_id', user.id)
          .limit(1)
          .maybeSingle();

        console.log("ACTIVE STORE (stores.owner_id):", data);

        if (error) throw error;
        if (!isMounted) return;

        setStore((data as unknown as StoreSettings) || null);
      } catch (err) {
        console.error('Erreur récupération boutique active:', err);
        if (isMounted) {
          toast({
            title: "Erreur",
            description: "Impossible de charger votre boutique active",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStore();

    return () => { isMounted = false; };
  }, [toast]);

  return { store, isLoading };
};
