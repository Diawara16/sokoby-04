import { CartState } from "@/types/cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderSummaryProps {
  state: CartState;
}

export const OrderSummary = ({ state }: OrderSummaryProps) => {
  return (
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
        </div>
      </CardContent>
    </Card>
  );
};