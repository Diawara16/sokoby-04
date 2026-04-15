import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DomainGating {
  isLoading: boolean;
  currentPlan: string;
  customDomainAllowed: boolean;
  domainsAllowed: number; // -1 = unlimited
  domainsUsed: number;
  canAddDomain: boolean;
  remainingDomains: number | null; // null = unlimited
  storeId: string | null;
}

const PLAN_DEFAULTS: Record<string, { custom_domain: boolean; domains_allowed: number }> = {
  free: { custom_domain: false, domains_allowed: 0 },
  basic: { custom_domain: true, domains_allowed: 1 },
  pro: { custom_domain: true, domains_allowed: 5 },
  business: { custom_domain: true, domains_allowed: -1 },
};

export const useDomainFeatureGating = () => {
  const [gating, setGating] = useState<DomainGating>({
    isLoading: true,
    currentPlan: "free",
    customDomainAllowed: false,
    domainsAllowed: 0,
    domainsUsed: 0,
    canAddDomain: false,
    remainingDomains: 0,
    storeId: null,
  });

  const load = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setGating(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Get store + subscription in parallel
      const [storeRes, domainsRes] = await Promise.all([
        supabase
          .from("stores")
          .select("id")
          .eq("owner_id", user.id)
          .limit(1)
          .maybeSingle(),
        supabase
          .from("domains")
          .select("id", { count: "exact" })
          .eq("user_id", user.id),
      ]);

      const storeId = storeRes.data?.id;
      const domainsUsed = domainsRes.count ?? 0;

      let planSlug = "free";
      let featureLimits: any = null;

      if (storeId) {
        const { data: sub } = await supabase
          .from("store_subscriptions")
          .select("*, plans(*)")
          .eq("store_id", storeId)
          .in("status", ["active", "trial"])
          .limit(1)
          .maybeSingle();

        if (sub?.plans) {
          const plan = sub.plans as any;
          planSlug = plan.slug || "free";
          featureLimits = plan.feature_limits;
        }
      }

      // Use feature_limits from DB if available, otherwise use defaults
      const defaults = PLAN_DEFAULTS[planSlug] || PLAN_DEFAULTS.free;
      const customDomainAllowed = featureLimits?.custom_domain ?? defaults.custom_domain;
      const domainsAllowed = featureLimits?.domains_allowed ?? defaults.domains_allowed;

      const isUnlimited = domainsAllowed === -1;
      const canAddDomain = customDomainAllowed && (isUnlimited || domainsUsed < domainsAllowed);

      setGating({
        isLoading: false,
        currentPlan: planSlug,
        customDomainAllowed,
        domainsAllowed,
        domainsUsed,
        canAddDomain,
        remainingDomains: isUnlimited ? null : Math.max(0, domainsAllowed - domainsUsed),
        storeId: storeId || null,
      });
    } catch (error) {
      console.error("Domain feature gating error:", error);
      // Safe fallback: allow existing access, don't block
      setGating(prev => ({ ...prev, isLoading: false, canAddDomain: true, customDomainAllowed: true }));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Realtime: auto-refresh when subscription changes
  useEffect(() => {
    if (!gating.storeId) return;

    const channel = supabase
      .channel(`domain_gating_${gating.storeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_subscriptions',
          filter: `store_id=eq.${gating.storeId}`,
        },
        () => {
          console.log('[useDomainFeatureGating] Subscription changed, refreshing gating...');
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gating.storeId, load]);

  return { ...gating, refresh: load };
};
