import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  feature_limits: Record<string, any>;
  is_active: boolean;
  display_order: number;
}

export interface StoreSubscription {
  id: string;
  store_id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
  start_date: string;
  end_date: string | null;
  renewal_date: string | null;
  stripe_subscription_id: string | null;
  canceled_at: string | null;
  created_at: string;
  plans?: Plan;
}

export const useStoreSubscription = (storeId: string | null) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<StoreSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (!error && data) {
      setPlans(data as unknown as Plan[]);
    }
  };

  const loadSubscription = async () => {
    if (!storeId) return;

    const { data, error } = await supabase
      .from('store_subscriptions')
      .select('*, plans(*)')
      .eq('store_id', storeId)
      .in('status', ['active', 'trial'])
      .limit(1)
      .maybeSingle();

    if (!error) {
      setSubscription(data as unknown as StoreSubscription | null);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([loadPlans(), loadSubscription()]);
      setIsLoading(false);
    };
    init();
  }, [storeId]);

  const selectPlan = async (planId: string, billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    if (!storeId) {
      toast({
        title: "Erreur",
        description: "Aucune boutique sélectionnée.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For now, redirect to existing Stripe checkout flow
      const selectedPlan = plans.find(p => p.id === planId);
      if (!selectedPlan) throw new Error('Plan introuvable');

      // Store plan selection for checkout
      sessionStorage.setItem('selectedStorePlan', JSON.stringify({
        planId,
        planSlug: selectedPlan.slug,
        storeId,
        billingCycle,
        price: billingCycle === 'yearly' ? selectedPlan.price_yearly : selectedPlan.price_monthly,
      }));

      toast({
        title: "Plan sélectionné",
        description: `Plan ${selectedPlan.name} (${billingCycle === 'yearly' ? 'annuel' : 'mensuel'}) sélectionné. Redirection vers le paiement...`,
      });

      // Integration point: redirect to Stripe checkout
      // This will be wired up to the existing Stripe flow
      return { planId, billingCycle, storeId };
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sélectionner ce plan.",
        variant: "destructive",
      });
    }
  };

  return {
    plans,
    subscription,
    isLoading,
    selectPlan,
    refresh: () => {
      loadPlans();
      loadSubscription();
    },
  };
};
