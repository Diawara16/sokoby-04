import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface StoreDomain {
  id: string;
  store_id: string | null;
  domain: string | null;
  provider: string;
  status: string;
  is_primary: boolean;
  purchase_price: number | null;
  currency: string | null;
  dns_auto_configured: boolean;
  dns_setup_error: string | null;
  provider_order_id: string | null;
  verified: boolean | null;
  updated_at: string;
}

export const useStoreDomains = (storeId?: string) => {
  const [domains, setDomains] = useState<StoreDomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDomains = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from("store_domains")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (storeId) {
        query = query.eq("store_id", storeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setDomains((data as StoreDomain[]) || []);
    } catch (error) {
      console.error("Error fetching store domains:", error);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const purchaseDomain = async (
    domain: string,
    provider: "namecheap" | "cloudflare" | "manual",
    price?: number,
    currency?: string
  ): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Erreur", description: "Vous devez être connecté.", variant: "destructive" });
        return false;
      }

      const resolvedStoreId = storeId || await getDefaultStoreId(user.id);
      if (!resolvedStoreId) {
        toast({ title: "Erreur", description: "Aucune boutique trouvée.", variant: "destructive" });
        return false;
      }

      const cleanDomain = domain.toLowerCase().trim();

      // Ownership protection: check if domain already exists for another user
      const { data: existing } = await supabase
        .from("store_domains")
        .select("id, user_id")
        .eq("domain", cleanDomain)
        .maybeSingle();

      if (existing && existing.user_id !== user.id) {
        toast({ title: "Domaine déjà utilisé", description: "Ce domaine est associé à une autre boutique.", variant: "destructive" });
        return false;
      }

      const { error } = await supabase.from("store_domains").insert({
        store_id: resolvedStoreId,
        user_id: user.id,
        domain: cleanDomain,
        provider,
        status: "pending",
        is_primary: false,
        purchase_price: price ?? null,
        currency: currency ?? "USD",
        dns_auto_configured: false,
      });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Domaine déjà enregistré", description: "Ce domaine est déjà associé à une boutique.", variant: "destructive" });
        } else {
          throw error;
        }
        return false;
      }

      await attemptAutoDnsSetup(cleanDomain, resolvedStoreId);
      await fetchDomains();
      toast({ title: "Domaine ajouté", description: `${domain} a été enregistré avec le statut « en attente ».` });
      return true;
    } catch (error: any) {
      console.error("Purchase domain error:", error);
      toast({ title: "Erreur", description: error.message || "Impossible d'enregistrer le domaine.", variant: "destructive" });
      return false;
    }
  };

  const attemptAutoDnsSetup = async (domain: string, currentStoreId: string) => {
    // In a real implementation, this would call Namecheap/Cloudflare API
    // to set A record → 185.158.133.1 and www CNAME
    // For now, mark as not auto-configured and provide manual instructions
    try {
      await supabase
        .from("store_domains")
        .update({
          dns_auto_configured: false,
          dns_setup_error: "Configuration DNS automatique non disponible. Veuillez configurer manuellement.",
        })
        .eq("store_id", currentStoreId)
        .eq("domain", domain.toLowerCase().trim());
    } catch (e) {
      console.error("Auto DNS setup error:", e);
    }
  };

  const verifyDomain = async (domainId: string, domainName: string): Promise<boolean> => {
    try {
      // Try A record first
      const aResponse = await fetch(`https://dns.google/resolve?name=${domainName}&type=A`);
      const aData = await aResponse.json();
      const aRecordValid = !!aData.Answer?.some(
        (record: any) => record.type === 1 && record.data === "185.158.133.1"
      );

      // TXT fallback if A record fails
      let txtRecordValid = false;
      if (!aRecordValid) {
        try {
          const txtResponse = await fetch(`https://dns.google/resolve?name=_sokoby-verify.${domainName}&type=TXT`);
          const txtData = await txtResponse.json();
          txtRecordValid = !!txtData.Answer?.some(
            (record: any) => record.type === 16 && typeof record.data === "string" && record.data.includes("sokoby-verify=")
          );
        } catch {
          txtRecordValid = false;
        }
      }

      const verified = aRecordValid || txtRecordValid;

      await supabase
        .from("store_domains")
        .update({
          status: verified ? "active" : "pending",
          verified,
          dns_auto_configured: aRecordValid,
          dns_setup_error: verified ? null : "Le DNS ne pointe pas encore vers 185.158.133.1. Essayez aussi le TXT _sokoby-verify.",
        })
        .eq("id", domainId);

      await fetchDomains();

      if (verified) {
        const method = aRecordValid ? "enregistrement A" : "enregistrement TXT";
        toast({ title: "Domaine vérifié !", description: `${domainName} vérifié via ${method}.` });
      } else {
        toast({ title: "DNS non configuré", description: "Configurez l'enregistrement A ou TXT", variant: "destructive" });
      }

      return verified;
    } catch (error) {
      console.error("Verify domain error:", error);
      toast({ title: "Erreur de vérification", variant: "destructive" });
      return false;
    }
  };

  const removeDomain = async (domainId: string) => {
    try {
      const { error } = await supabase.from("store_domains").delete().eq("id", domainId);
      if (error) throw error;
      await fetchDomains();
      toast({ title: "Domaine supprimé" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer le domaine.", variant: "destructive" });
    }
  };

  const setPrimary = async (domainId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const resolvedStoreId = storeId || await getDefaultStoreId(user.id);

      // Scope primary unset to same store (prevent cross-store interference)
      if (resolvedStoreId) {
        await supabase.from("store_domains").update({ is_primary: false }).eq("store_id", resolvedStoreId);
      } else {
        await supabase.from("store_domains").update({ is_primary: false }).eq("user_id", user.id);
      }
      // Set new primary
      await supabase.from("store_domains").update({ is_primary: true }).eq("id", domainId).eq("user_id", user.id);
      await fetchDomains();
      toast({ title: "Domaine principal mis à jour" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  return {
    domains,
    isLoading,
    purchaseDomain,
    verifyDomain,
    removeDomain,
    setPrimary,
    refetch: fetchDomains,
  };
};

async function getDefaultStoreId(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from("store_settings")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  return data?.id ?? null;
}
