
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface PaymentButtonsProps {
  planType: 'starter' | 'pro' | 'enterprise';
  couponCode?: string;
  onSubscribe: (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'interac',
    couponCode?: string
  ) => void;
}

export const PaymentButtons = ({ planType, couponCode, onSubscribe }: PaymentButtonsProps) => {
  const handleClick = () => {
    try {
      console.log('Payment button clicked for plan:', planType);
      onSubscribe(planType, 'card', couponCode);
    } catch (error) {
      console.error('Error in payment button:', error);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        onClick={handleClick}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Commencer l'essai gratuit
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>Paiement sécurisé avec Stripe</p>
        <p>Aucun frais pendant la période d'essai</p>
      </div>
    </div>
  );
};
