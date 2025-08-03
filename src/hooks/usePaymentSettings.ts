import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { PaymentSettings } from '@/types/settings';

export const usePaymentSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const savePaymentSettings = async (settings: Partial<PaymentSettings>) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Non authentifié');
      }

      // Note: payment_settings column doesn't exist in store_settings table
      // This would need to be created or use a different approach
      console.log('Payment settings would be saved:', settings);
      
      toast({
        title: "Information",
        description: "Fonctionnalité en cours de développement",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    savePaymentSettings
  };
};