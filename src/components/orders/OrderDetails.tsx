import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { OrderHeader } from './OrderHeader';
import { OrderItemsList } from './OrderItemsList';
import { OrderAddresses } from './OrderAddresses';
import type { Order } from '@/types/orders';

interface OrderDetailsProps {
  orderId: string;
}

export const OrderDetails = ({ orderId }: OrderDetailsProps) => {
  const { data: order, isLoading, refetch } = useQuery({
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
      <OrderHeader order={order} onStatusUpdate={refetch} />
      <OrderItemsList items={order.items} />
      {(order.shipping_address || order.billing_address) && (
        <OrderAddresses
          shippingAddress={order.shipping_address}
          billingAddress={order.billing_address}
        />
      )}
    </div>
  );
};