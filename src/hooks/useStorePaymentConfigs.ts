import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type PaymentProvider = "stripe" | "paypal" | "interac" | "klarna" | "crypto";

export interface StorePaymentConfig {
  id?: string;
  store_id: string;
  user_id: string;
  provider: PaymentProvider;
  publishable_key: string;
  account_id: string;
  config: Record<string, any>;
  is_active: boolean;
}

export function useStorePaymentConfigs(storeId: string | undefined) {
  const [configs, setConfigs] = useState<StorePaymentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = useCallback(async () => {
    if (!storeId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("store_payment_configs")
        .select("*")
        .eq("store_id", storeId);
      if (error) throw error;
      setConfigs((data || []) as unknown as StorePaymentConfig[]);
    } catch (err) {
      console.error("Failed to load payment configs:", err);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => { load(); }, [load]);

  const upsertConfig = useCallback(async (
    provider: PaymentProvider,
    updates: Partial<Pick<StorePaymentConfig, "publishable_key" | "account_id" | "config" | "is_active">>
  ) => {
    if (!storeId) return false;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const existing = configs.find(c => c.provider === provider);
      
      if (existing?.id) {
        const { error } = await supabase
          .from("store_payment_configs")
          .update({ ...updates, updated_at: new Date().toISOString() } as any)
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("store_payment_configs")
          .insert({
            store_id: storeId,
            user_id: user.id,
            provider,
            publishable_key: updates.publishable_key || "",
            account_id: updates.account_id || "",
            config: updates.config || {},
            is_active: updates.is_active ?? false,
          } as any);
        if (error) throw error;
      }

      await load();
      return true;
    } catch (err: any) {
      console.error("Failed to save payment config:", err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de sauvegarder la configuration",
        variant: "destructive",
      });
      return false;
    }
  }, [storeId, configs, load, toast]);

  const getConfig = useCallback((provider: PaymentProvider) => {
    return configs.find(c => c.provider === provider);
  }, [configs]);

  return { configs, loading, upsertConfig, getConfig, reload: load };
}
