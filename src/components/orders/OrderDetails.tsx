import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  product: {
    name: string;
    image: string | null;
  };
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  } | null;
  billing_address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  } | null;
  items: OrderItem[];
}

const statusColors = {
  pending: "secondary",
  processing: "warning",
  completed: "success",
  cancelled: "destructive",
  refunded: "default",
} as const;

const statusLabels = {
  pending: "En attente",
  processing: "En cours",
  completed: "Complétée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

interface OrderDetailsProps {
  orderId: string;
}

export const OrderDetails = ({ orderId }: OrderDetailsProps) => {
  const { data: order, isLoading } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(
              name,
              image
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data as Order;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Chargement de la commande...</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Commande non trouvée</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Commande #{order.id.slice(0, 8)}</h2>
          <p className="text-muted-foreground">
            {format(new Date(order.created_at), 'PPP', { locale: fr })}
          </p>
        </div>
        <Badge variant={statusColors[order.status as keyof typeof statusColors]}>
          {statusLabels[order.status as keyof typeof statusLabels]}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles commandés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantité: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {(item.price_at_time * item.quantity).toFixed(2)} €
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.price_at_time.toFixed(2)} € / unité
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center font-medium">
            <span>Total</span>
            <span>{order.total_amount.toFixed(2)} €</span>
          </div>
        </CardContent>
      </Card>

      {(order.shipping_address || order.billing_address) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {order.shipping_address && (
            <Card>
              <CardHeader>
                <CardTitle>Adresse de livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.shipping_address.street}</p>
                <p>
                  {order.shipping_address.postal_code} {order.shipping_address.city}
                </p>
                <p>{order.shipping_address.country}</p>
              </CardContent>
            </Card>
          )}

          {order.billing_address && (
            <Card>
              <CardHeader>
                <CardTitle>Adresse de facturation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.billing_address.street}</p>
                <p>
                  {order.billing_address.postal_code} {order.billing_address.city}
                </p>
                <p>{order.billing_address.country}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};