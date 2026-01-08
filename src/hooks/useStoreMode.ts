import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StoreMode {
  isProduction: boolean;
  isLoading: boolean;
  storeName: string | null;
  storeId: string | null;
  storeOwnerId: string | null;
}

export function useStoreMode(userId: string | undefined): StoreMode {
  const [isProduction, setIsProduction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeOwnerId, setStoreOwnerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreMode = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // First check if user is the direct store owner
        let { data, error } = await supabase
          .from('store_settings')
          .select('id, is_production, store_name, user_id')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // If not found, check if user is a staff member of a store
        if (!data) {
          const { data: staffData, error: staffError } = await supabase
            .from('staff_members')
            .select('store_id, store_settings:store_id(id, is_production, store_name, user_id)')
            .eq('user_id', userId)
            .eq('status', 'active')
            .limit(1)
            .maybeSingle();

          if (!staffError && staffData && staffData.store_settings) {
            const storeSettings = staffData.store_settings as any;
            data = {
              id: storeSettings.id,
              is_production: storeSettings.is_production,
              store_name: storeSettings.store_name,
              user_id: storeSettings.user_id,
            };
          }
        }

        if (error) {
          console.error('Error fetching store mode:', error);
        } else if (data) {
          setIsProduction(data.is_production || false);
          setStoreName(data.store_name || null);
          setStoreId(data.id || null);
          setStoreOwnerId(data.user_id || null);
        }
      } catch (err) {
        console.error('Error in useStoreMode:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreMode();
  }, [userId]);

  return { isProduction, isLoading, storeName, storeId, storeOwnerId };
}
