import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { InteracPaymentForm } from "@/components/payments/InteracPaymentForm";
import { PayPalButton } from "@/components/payments/PayPalButton";
import { ApplePayButton } from "@/components/payments/ApplePayButton";
import { GooglePayButton } from "@/components/payments/GooglePayButton";
import { KlarnaButton } from "@/components/payments/KlarnaButton";
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'interac' | 'paypal' | 'apple_pay' | 'google_pay' | 'klarna'>('card');

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Button
          type="button"
          variant={paymentMethod === 'card' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => setPaymentMethod('card')}
        >
          Carte bancaire
        </Button>
        <Button
          type="button"
          variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => setPaymentMethod('paypal')}
        >
          PayPal
        </Button>
        <Button
          type="button"
          variant={paymentMethod === 'interac' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => setPaymentMethod('interac')}
        >
          Interac
        </Button>
        <Button
          type="button"
          variant={paymentMethod === 'apple_pay' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => setPaymentMethod('apple_pay')}
        >
          Apple Pay
        </Button>
        <Button
          type="button"
          variant={paymentMethod === 'google_pay' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => setPaymentMethod('google_pay')}
        >
          Google Pay
        </Button>
        <Button
          type="button"
          variant={paymentMethod === 'klarna' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => setPaymentMethod('klarna')}
        >
          Klarna
        </Button>
      </div>

      {paymentMethod === 'interac' ? (
        <InteracPaymentForm 
          orderId={orderId}
          amount={total}
          onSuccess={onPaymentSuccess}
        />
      ) : paymentMethod === 'paypal' ? (
        <PayPalButton
          amount={total}
          orderId={orderId}
          onSuccess={onPaymentSuccess}
        />
      ) : paymentMethod === 'apple_pay' ? (
        <ApplePayButton
          amount={total}
          orderId={orderId}
          onSuccess={onPaymentSuccess}
        />
      ) : paymentMethod === 'google_pay' ? (
        <GooglePayButton
          amount={total}
          orderId={orderId}
          onSuccess={onPaymentSuccess}
        />
      ) : paymentMethod === 'klarna' ? (
        <KlarnaButton
          amount={total}
          orderId={orderId}
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