import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInteracPayment } from '@/hooks/useInteracPayment';
import { Loader2 } from "lucide-react";

interface InteracPaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
}

export const InteracPaymentForm = ({ orderId, amount, onSuccess }: InteracPaymentFormProps) => {
  const { createInteracPayment, isLoading } = useInteracPayment();
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const handlePayment = async () => {
    const payment = await createInteracPayment(orderId, amount);
    if (payment) {
      setPaymentInitiated(true);
      onSuccess();
    }
  };

  if (paymentInitiated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Instructions de paiement Interac</CardTitle>
          <CardDescription>
            Suivez ces étapes pour compléter votre paiement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Connectez-vous à votre service bancaire en ligne</li>
            <li>Sélectionnez l'option Virement Interac</li>
            <li>Envoyez le montant exact de {amount.toFixed(2)} $</li>
            <li>Utilisez votre numéro de commande comme message</li>
            <li>Une fois le virement effectué, nous traiterons votre commande</li>
          </ol>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button 
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Initialisation du paiement...
        </>
      ) : (
        "Payer avec Interac"
      )}
    </Button>
  );
};