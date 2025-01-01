import React from 'react';
import { useParams } from 'react-router-dom';
import { OrderDetails } from '@/components/orders/OrderDetails';

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>ID de commande manquant</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetails orderId={id} />
    </div>
  );
}