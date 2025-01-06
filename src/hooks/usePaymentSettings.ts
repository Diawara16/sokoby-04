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

      const { error } = await supabase
        .from('store_settings')
        .update({ 
          payment_settings: settings 
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Paramètres de paiement mis à jour",
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