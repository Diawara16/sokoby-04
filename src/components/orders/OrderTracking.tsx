import { Package, Truck, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OrderTrackingProps {
  order: {
    id: string;
    status: string;
    tracking_number?: string;
    shipping_carrier?: string;
    estimated_delivery_date?: string;
    created_at: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "processing":
      return "bg-yellow-500";
    case "shipped":
      return "bg-blue-500";
    case "delivered":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "En attente";
    case "processing":
      return "En préparation";
    case "shipped":
      return "Expédié";
    case "delivered":
      return "Livré";
    default:
      return status;
  }
};

export const OrderTracking = ({ order }: OrderTrackingProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Suivi de commande #{order.id.slice(0, 8)}</span>
          <Badge variant="outline">{getStatusLabel(order.status)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Package className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Commande passée</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.created_at), 'PPP', { locale: fr })}
            </p>
          </div>
        </div>

        {order.shipping_carrier && order.tracking_number && (
          <div className="flex items-center gap-4">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">En transit avec {order.shipping_carrier}</p>
              <p className="text-sm text-muted-foreground">
                Numéro de suivi: {order.tracking_number}
              </p>
            </div>
          </div>
        )}

        {order.estimated_delivery_date && (
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Livraison estimée</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(order.estimated_delivery_date), 'PPP', { locale: fr })}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};