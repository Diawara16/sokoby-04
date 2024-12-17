import React from 'react';
import { useCart } from '@/components/cart/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Checkout = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer un achat",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            price_data: {
              currency: 'eur',
              product_data: {
                name: item.name,
              },
              unit_amount: item.price * 100, // Stripe expects amounts in cents
            },
            quantity: item.quantity,
          })),
        }),
      });

      const { url } = await response.json();

      if (url) {
        clearCart();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif de votre commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantité: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {(item.price * item.quantity).toFixed(2)} €
                </p>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-medium">{state.total.toFixed(2)} €</span>
              </div>
            </div>
            <Button
              className="w-full mt-4"
              onClick={handleCheckout}
              disabled={state.items.length === 0}
            >
              Payer {state.total.toFixed(2)} €
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;