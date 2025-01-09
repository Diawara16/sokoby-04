import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useInteracPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createInteracPayment = async (orderId: string, amount: number) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Non authentifié');
      }

      // Générer un numéro de référence unique
      const referenceNumber = `INT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { data, error } = await supabase
        .from('interac_payments')
        .insert({
          order_id: orderId,
          user_id: user.id,
          amount,
          reference_number: referenceNumber,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Paiement Interac initialisé",
        description: "Veuillez compléter le virement avec votre banque",
      });

      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser le paiement Interac",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createInteracPayment
  };
};