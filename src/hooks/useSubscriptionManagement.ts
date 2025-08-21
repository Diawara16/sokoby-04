import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Subscription {
  id: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
  stripe_subscription_id?: string;
}

export interface Invoice {
  id: string;
  amount: number;
  created_at: string;
  status: string;
  invoice_url?: string;
  payment_method?: string;
}

export const useSubscriptionManagement = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const loadInvoices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    }
  };

  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-billing-portal-session');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        
        toast({
          title: "Portail de facturation ouvert",
          description: "Vous pouvez maintenant annuler votre abonnement dans l'onglet ouvert.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'accéder au portail de facturation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reportDoubleCharge = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Create a support ticket for double charge
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: 'Signalement de facturation double',
          message: 'Je signale une facturation double sur mon compte. Merci de vérifier et de procéder au remboursement si nécessaire.',
          category: 'billing',
          priority: 'high'
        });

      if (error) throw error;

      toast({
        title: "Signalement envoyé",
        description: "Votre signalement a été envoyé. Notre équipe vous contactera sous 24h pour résoudre le problème.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le signalement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkForDuplicateSubscription = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      
      return (data?.length || 0) > 1;
    } catch (error) {
      console.error('Error checking for duplicate subscriptions:', error);
      return false;
    }
  };

  useEffect(() => {
    loadSubscription();
    loadInvoices();
  }, []);

  return {
    subscription,
    invoices,
    isLoading,
    cancelSubscription,
    reportDoubleCharge,
    checkForDuplicateSubscription,
    refreshData: () => {
      loadSubscription();
      loadInvoices();
    }
  };
};