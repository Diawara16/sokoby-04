import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface GooglePayButtonProps {
  amount: number;
  orderId?: string;
  onSuccess: () => void;
}

export const GooglePayButton = ({ amount, orderId, onSuccess }: GooglePayButtonProps) => {
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
          provider: 'google_pay',
          settings: {
            order_id: orderId,
            amount: amount
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Paiement Google Pay initialisé",
        description: "Veuillez compléter le paiement sur votre appareil",
      });

      // Simuler un paiement réussi pour la démo
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser le paiement Google Pay",
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
      className="w-full bg-white text-black hover:bg-gray-100 border border-gray-300"
    >
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#4285F4"/>
      </svg>
      {isLoading ? "Traitement..." : "Payer avec Google Pay"}
    </Button>
  );
};