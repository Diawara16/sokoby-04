import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { InteracPaymentForm } from "@/components/payments/InteracPaymentForm";
import { useState } from "react";

interface PaymentSectionProps {
  total: number;
  isLoading: boolean;
  orderId?: string;
  onPaymentSuccess: () => void;
}

export const PaymentSection = ({ 
  total, 
  isLoading, 
  orderId,
  onPaymentSuccess 
}: PaymentSectionProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'interac'>('card');

  if (!orderId) {
    return (
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création de la commande...
          </>
        ) : (
          `Payer ${total.toFixed(2)} €`
        )}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button
          type="button"
          variant={paymentMethod === 'card' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setPaymentMethod('card')}
        >
          Carte bancaire
        </Button>
        <Button
          type="button"
          variant={paymentMethod === 'interac' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setPaymentMethod('interac')}
        >
          Interac
        </Button>
      </div>

      {paymentMethod === 'interac' ? (
        <InteracPaymentForm 
          orderId={orderId}
          amount={total}
          onSuccess={onPaymentSuccess}
        />
      ) : (
        <Button className="w-full">
          Payer par carte
        </Button>
      )}
    </div>
  );
};