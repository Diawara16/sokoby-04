import { useEffect, useState } from "react";
import { OrderHeader } from "./OrderHeader";
import { OrderAddresses } from "./OrderAddresses";
import { OrderItemsList } from "./OrderItemsList";
import { OrderStatistics } from "./OrderStatistics";
import { OrderTracking } from "./OrderTracking";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types/orders";

interface OrderDetailsProps {
  orderId: string;
}

export const OrderDetails = ({ orderId }: OrderDetailsProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          id,
          quantity,
          price_at_time,
          product:products(
            name,
            image
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de la commande",
        variant: "destructive",
      });
      return;
    }

    setOrder({
      ...data,
      shipping_address: data.shipping_address as any,
      billing_address: data.billing_address as any,
      items: data.items.map((item: any) => ({
        ...item,
        product_id: item.product_id || item.id
      }))
    });
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <OrderStatistics />
      <OrderTracking order={order} />
      <Card>
        <OrderHeader 
          order={order} 
          onStatusUpdate={fetchOrder} 
        />
        <OrderAddresses 
          shippingAddress={order.shipping_address} 
          billingAddress={order.billing_address} 
        />
        <OrderItemsList 
          items={order.items} 
        />
      </Card>
    </div>
  );
};