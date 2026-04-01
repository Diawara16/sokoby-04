import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
          .from('stores')
          .select('id, store_name, owner_id, status')
          .eq('owner_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        console.log("STORE MODE (stores.owner_id):", data);

        // If not found, check if user is a staff member of a store
        if (!data) {
          const { data: staffData, error: staffError } = await supabase
            .from('staff_members')
            .select('store_id, stores:store_id(id, store_name, owner_id, status)')
            .eq('user_id', userId)
            .eq('status', 'active')
            .limit(1)
            .maybeSingle();

          if (!staffError && staffData && (staffData as any).stores) {
            const storeRow = (staffData as any).stores;
            data = {
              id: storeRow.id,
              store_name: storeRow.store_name,
              owner_id: storeRow.owner_id,
              status: storeRow.status,
            };
          }
        }

        if (error) {
          console.error('Error fetching store mode:', error);
        } else if (data) {
          setIsProduction(data.status === 'active');
          setStoreName(data.store_name || null);
          setStoreId(data.id || null);
          setStoreOwnerId(data.owner_id || null);
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
