import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface ApplePayButtonProps {
  amount: number;
  orderId?: string;
  onSuccess: () => void;
}

export const ApplePayButton = ({ amount, orderId, onSuccess }: ApplePayButtonProps) => {
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
          provider: 'apple_pay',
          settings: {
            order_id: orderId,
            amount: amount
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Paiement Apple Pay initialisé",
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
        description: "Impossible d'initialiser le paiement Apple Pay",
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
      className="w-full bg-black hover:bg-gray-800"
    >
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.0425 10.8116C16.9938 8.61901 18.8557 7.36403 18.9519 7.30007C17.8038 5.58071 15.9906 5.33516 15.3562 5.31541C13.8506 5.15519 12.3931 6.22342 11.6274 6.22342C10.8453 6.22342 9.63347 5.33516 8.37849 5.36478C6.73569 5.39441 5.20781 6.34631 4.37818 7.83282C2.65882 10.8711 3.91381 15.3772 5.5566 17.8238C6.38623 19.0195 7.36788 20.3729 8.67149 20.3235C9.94622 20.2741 10.4325 19.4939 11.9677 19.4939C13.4862 19.4939 13.9428 20.3235 15.2761 20.2938C16.6487 20.2741 17.4981 19.0788 18.2981 17.8732C19.2501 16.4908 19.6375 15.1374 19.6572 15.0682C19.6177 15.0583 17.0918 14.0766 17.0425 10.8116Z"/>
      </svg>
      {isLoading ? "Traitement..." : "Payer avec Apple Pay"}
    </Button>
  );
};