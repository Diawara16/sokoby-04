import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StoreMode {
  isProduction: boolean;
  isLoading: boolean;
  storeName: string | null;
}

export function useStoreMode(userId: string | undefined): StoreMode {
  const [isProduction, setIsProduction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storeName, setStoreName] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreMode = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('is_production, store_name')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching store mode:', error);
        } else if (data) {
          setIsProduction(data.is_production || false);
          setStoreName(data.store_name || null);
        }
      } catch (err) {
        console.error('Error in useStoreMode:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreMode();
  }, [userId]);

  return { isProduction, isLoading, storeName };
}
