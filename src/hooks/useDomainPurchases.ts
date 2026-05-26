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

      // Resume-or-create: reuse the user's existing reservation for the same domain
      // when it has not been paid/purchased yet. This avoids 23505 conflicts and
      // lets the caller proceed directly to startDomainCheckout(existingId, years).
      const { data: existing, error: lookupErr } = await supabase
        .from("domain_purchases")
        .select("id, status, paid_at")
        .eq("user_id", user.id)
        .eq("domain_name", cleanDomain)
        .maybeSingle();

      if (lookupErr) throw lookupErr;

      if (existing) {
        if (existing.status === "purchased" || existing.paid_at) {
          toast({
            title: "Domaine déjà acheté",
            description: `${cleanDomain} est déjà enregistré sur votre compte.`,
            variant: "destructive",
          });
          return { success: false, id: null };
        }
        // pending / failed / purchasing-without-payment → reuse this reservation
        return { success: true, id: existing.id };
      }

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
        // Race: another concurrent insert won. Resume the existing row instead of failing.
        if (error.code === "23505") {
          const { data: raceRow } = await supabase
            .from("domain_purchases")
            .select("id, status, paid_at")
            .eq("user_id", user.id)
            .eq("domain_name", cleanDomain)
            .maybeSingle();

          if (raceRow && raceRow.status !== "purchased" && !raceRow.paid_at) {
            return { success: true, id: raceRow.id };
          }
          toast({
            title: "Domaine déjà acheté",
            description: `${cleanDomain} est déjà enregistré.`,
            variant: "destructive",
          });
          return { success: false, id: null };
        }
        throw error;
      }

      await fetchPurchases();
      return { success: true, id: data.id };
    } catch (e: any) {
      console.error("reserveDomain error:", e);
      toast({ title: "Erreur", description: e.message || "Impossible de réserver ce domaine.", variant: "destructive" });
      return { success: false, id: null };
    }
  };

  const completePurchase = async (
    purchaseId: string,
    years = 1,
    stripeSessionId?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke("purchase-domain-secure", {
        body: { purchaseId, years, stripeSessionId },
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

  /**
   * Starts a Stripe Checkout session for a reserved domain.
   * Redirects to Stripe; on return, the success page must call
   * completePurchase(purchaseId, years, sessionId) to finalize registration.
   */
  const startDomainCheckout = async (
    purchaseId: string,
    years = 1,
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke("create-domain-checkout", {
        body: {
          purchaseId,
          years,
          successUrl: `${window.location.origin}/parametres/domaine?purchase=success`,
          cancelUrl: `${window.location.origin}/parametres/domaine?purchase=cancelled`,
        },
      });
      if (error) throw new Error(error.message);
      if (!data?.url) throw new Error(data?.error || "Impossible de démarrer le paiement");
      return { success: true, url: data.url };
    } catch (e: any) {
      toast({ title: "Erreur de paiement", description: e.message, variant: "destructive" });
      return { success: false, error: e.message };
    }
  };

  return { purchases, isLoading, reserveDomain, completePurchase, startDomainCheckout, refetch: fetchPurchases };
};
