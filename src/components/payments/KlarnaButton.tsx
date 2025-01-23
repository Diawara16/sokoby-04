import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface KlarnaButtonProps {
  amount: number;
  orderId?: string;
  onSuccess: () => void;
}

export const KlarnaButton = ({ amount, orderId, onSuccess }: KlarnaButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Non authentifié');
      }

      const { data, error } = await supabase
        .from('payment_integrations')
        .insert({
          user_id: user.id,
          provider: 'klarna',
          settings: {
            order_id: orderId,
            amount: amount,
            payment_method: 'pay_later'
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Paiement Klarna initialisé",
        description: "Veuillez compléter le paiement avec Klarna",
      });

      // Simuler un paiement réussi pour la démo
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser le paiement Klarna",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-[#FFB3C7] hover:bg-[#FF8FAB] text-black"
    >
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
      {isLoading ? "Traitement..." : "Payer plus tard avec Klarna"}
    </Button>
  );
};