import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentStoreId = () => {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsLoading(false); return; }

        const { data } = await supabase
          .from("stores")
          .select("id")
          .eq("owner_id", user.id)
          .limit(1)
          .maybeSingle();

        setStoreId(data?.id ?? null);
      } catch {
        setStoreId(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return { storeId, isLoading };
};
