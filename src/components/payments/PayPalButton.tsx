import { useEffect } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useToast } from '@/hooks/use-toast';

interface PayPalButtonProps {
  amount: number;
  orderId?: string;
  onSuccess: () => void;
}

export const PayPalButton = ({ amount, orderId, onSuccess }: PayPalButtonProps) => {
  const { toast } = useToast();

  return (
    <PayPalButtons
      style={{ layout: "horizontal" }}
      createOrder={(data, actions) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                value: amount.toString(),
                currency_code: "EUR"
              },
              custom_id: orderId
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        if (actions.order) {
          const details = await actions.order.capture();
          if (details.status === "COMPLETED") {
            toast({
              title: "Paiement réussi",
              description: "Votre paiement a été traité avec succès",
            });
            onSuccess();
          }
        }
      }}
      onError={() => {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du paiement",
          variant: "destructive",
        });
      }}
    />
  );
};