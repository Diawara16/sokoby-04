import { Card, CardContent } from "@/components/ui/card";

interface CustomerOrdersTabProps {
  customer: {
    total_orders: number;
    total_spent: number;
    last_purchase_date: string | null;
  };
}

export const CustomerOrdersTab = ({ customer }: CustomerOrdersTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{customer.total_orders}</div>
          <p className="text-sm text-muted-foreground">Commandes totales</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{customer.total_spent}€</div>
          <p className="text-sm text-muted-foreground">Montant total</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            {customer.last_purchase_date 
              ? new Date(customer.last_purchase_date).toLocaleDateString('fr-FR')
              : 'Jamais'}
          </div>
          <p className="text-sm text-muted-foreground">Dernier achat</p>
        </CardContent>
      </Card>
    </div>
  );
};