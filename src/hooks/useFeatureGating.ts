import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlanFeatures {
  products_limit: number;
  domains_allowed: number;
  staff_accounts: number;
  analytics_access: boolean;
  custom_domain: boolean;
  remove_branding: boolean;
  advanced_analytics: boolean;
  multiple_domains: boolean;
}

interface StoreSubscriptionInfo {
  plan_name: string;
  plan_slug: string;
  status: string;
  billing_cycle: string;
  features: PlanFeatures;
  end_date: string | null;
  renewal_date: string | null;
}

const DEFAULT_FEATURES: PlanFeatures = {
  products_limit: 5,
  domains_allowed: 0,
  staff_accounts: 1,
  analytics_access: false,
  custom_domain: false,
  remove_branding: false,
  advanced_analytics: false,
  multiple_domains: false,
};

export const useFeatureGating = (storeId: string | null) => {
  const [subscription, setSubscription] = useState<StoreSubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storeId) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('store_subscriptions')
          .select('*, plans(*)')
          .eq('store_id', storeId)
          .in('status', ['active', 'trial', 'canceling'])
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data && data.plans) {
          const plan = data.plans as any;
          setSubscription({
            plan_name: plan.name,
            plan_slug: plan.slug,
            status: data.status,
            billing_cycle: data.billing_cycle,
            features: plan.feature_limits as PlanFeatures,
            end_date: data.end_date,
            renewal_date: data.renewal_date,
          });
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.error('Error loading store subscription:', err);
        setSubscription(null);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [storeId]);

  const isFeatureAllowed = useCallback(
    (featureKey: keyof PlanFeatures): boolean => {
      if (!subscription) return DEFAULT_FEATURES[featureKey] as boolean;
      const value = subscription.features[featureKey];
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number') return value !== 0;
      return false;
    },
    [subscription]
  );

  const getFeatureLimit = useCallback(
    (featureKey: keyof PlanFeatures): number => {
      if (!subscription) return DEFAULT_FEATURES[featureKey] as number;
      const value = subscription.features[featureKey];
      if (typeof value === 'number') return value; // -1 means unlimited
      return 0;
    },
    [subscription]
  );

  return {
    subscription,
    isLoading,
    isFeatureAllowed,
    getFeatureLimit,
    currentPlan: subscription?.plan_slug ?? 'free',
    isActive: subscription?.status === 'active' || subscription?.status === 'trial',
  };
};
