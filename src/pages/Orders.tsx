import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderList } from '@/components/orders/OrderList';

export default function Orders() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Commandes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historique des commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderList />
        </CardContent>
      </Card>
    </div>
  );
}