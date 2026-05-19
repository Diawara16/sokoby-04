import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DomainPurchase {
  id: string;
  user_id: string;
  store_id: string | null;
  domain_name: string;
  tld: string | null;
  status: "pending" | "purchasing" | "purchased" | "failed" | string;
  provider: string | null;
  provider_order_id: string | null;
  price_estimate: number | null;
  currency: string | null;
  years: number | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * useDomainPurchases — single source of truth for the purchase lifecycle.
 * Reads/writes exclusively to public.domain_purchases.
 * Does NOT touch public.store_domains (DNS lifecycle is fully isolated).
 */
export const useDomainPurchases = (storeId?: string) => {
  const [purchases, setPurchases] = useState<DomainPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPurchases = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let q = supabase
        .from("domain_purchases")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (storeId) q = q.eq("store_id", storeId);

      const { data, error } = await q;
      if (error) throw error;
      setPurchases((data as DomainPurchase[]) || []);
    } catch (e) {
      console.error("Error fetching domain_purchases:", e);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => { fetchPurchases(); }, [fetchPurchases]);

  const reserveDomain = async (
    domain: string,
    opts?: { provider?: string; price?: number; currency?: string; storeId?: string | null }
  ): Promise<{ success: boolean; id: string | null }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Erreur", description: "Vous devez être connecté.", variant: "destructive" });
        return { success: false, id: null };
      }

      const cleanDomain = domain.toLowerCase().trim();
      const parts = cleanDomain.split(".");
      const tld = parts.length > 1 ? parts.slice(1).join(".") : null;

      const { data, error } = await supabase
        .from("domain_purchases")
        .insert({
          user_id: user.id,
          store_id: opts?.storeId ?? storeId ?? null,
          domain_name: cleanDomain,
          tld,
          status: "pending",
          provider: opts?.provider ?? "manual",
          price_estimate: opts?.price ?? null,
          currency: opts?.currency ?? "USD",
        })
        .select("id")
        .single();

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Domaine déjà réservé", description: "Vous avez déjà une réservation active pour ce domaine.", variant: "destructive" });
        } else {
          throw error;
        }
        return { success: false, id: null };
      }

      await fetchPurchases();
      toast({ title: "Domaine réservé", description: `${cleanDomain} est en attente d'achat.` });
      return { success: true, id: data.id };
    } catch (e: any) {
      console.error("reserveDomain error:", e);
      toast({ title: "Erreur", description: e.message || "Impossible de réserver ce domaine.", variant: "destructive" });
      return { success: false, id: null };
    }
  };

  const completePurchase = async (
    purchaseId: string,
    years = 1
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke("purchase-domain-secure", {
        body: { purchaseId, years },
      });
      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || "Achat échoué");
      await fetchPurchases();
      return { success: true };
    } catch (e: any) {
      await fetchPurchases();
      return { success: false, error: e.message || "Achat échoué" };
    }
  };

  return { purchases, isLoading, reserveDomain, completePurchase, refetch: fetchPurchases };
};
