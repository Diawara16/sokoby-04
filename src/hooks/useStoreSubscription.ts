import { useState, useEffect, useCallback } from 'react';
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
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();

  const loadPlans = useCallback(async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (!error && data) {
      setPlans(data as unknown as Plan[]);
    }
  }, []);

  const loadSubscription = useCallback(async () => {
    if (!storeId) return;

    const { data, error } = await supabase
      .from('store_subscriptions')
      .select('*, plans(*)')
      .eq('store_id', storeId)
      .in('status', ['active', 'trial', 'canceling'])
      .limit(1)
      .maybeSingle();

    if (!error) {
      setSubscription(data as unknown as StoreSubscription | null);
    }
  }, [storeId]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([loadPlans(), loadSubscription()]);
      setIsLoading(false);
    };
    init();
  }, [loadPlans, loadSubscription]);

  // Realtime subscription for auto-refresh after payment
  useEffect(() => {
    if (!storeId) return;

    const channel = supabase
      .channel(`store_sub_${storeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_subscriptions',
          filter: `store_id=eq.${storeId}`,
        },
        () => {
          console.log('[useStoreSubscription] Realtime update detected, refreshing...');
          loadSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storeId, loadSubscription]);

  // Check URL for subscription success on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscription') === 'success') {
      toast({
        title: "Abonnement activé !",
        description: "Votre abonnement a été activé avec succès. Vos fonctionnalités sont désormais débloquées.",
      });
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('subscription');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
      // Refresh subscription data
      loadSubscription();
    }
  }, []);

  const selectPlan = async (planId: string, billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    if (!storeId) {
      toast({
        title: "Erreur",
        description: "Aucune boutique sélectionnée.",
        variant: "destructive",
      });
      return;
    }

    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) {
      toast({ title: "Erreur", description: "Plan introuvable.", variant: "destructive" });
      return;
    }

    // Free plan — activate directly via edge function
    if (selectedPlan.price_monthly === 0 && selectedPlan.price_yearly === 0) {
      setIsCheckingOut(true);
      try {
        const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
          body: { planId, storeId, billingCycle },
        });

        if (error) throw error;

        toast({
          title: "Plan gratuit activé",
          description: "Votre plan a été mis à jour.",
        });
        await loadSubscription();
      } catch (err: any) {
        toast({
          title: "Erreur",
          description: err.message || "Impossible d'activer le plan gratuit.",
          variant: "destructive",
        });
      } finally {
        setIsCheckingOut(false);
      }
      return;
    }

    // Paid plan — redirect to Stripe checkout
    setIsCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { planId, storeId, billingCycle },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Aucune URL de paiement reçue");
      }
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de créer la session de paiement.",
        variant: "destructive",
      });
      setIsCheckingOut(false);
    }
  };

  return {
    plans,
    subscription,
    isLoading,
    isCheckingOut,
    selectPlan,
    refresh: () => {
      loadPlans();
      loadSubscription();
    },
  };
};
