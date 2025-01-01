import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { OrderItem } from '@/types/orders';

interface OrderItemsListProps {
  items: OrderItem[];
}

export const OrderItemsList = ({ items }: OrderItemsListProps) => {
  const total = items.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles commandés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
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
          <span>{total.toFixed(2)} €</span>
        </div>
      </CardContent>
    </Card>
  );
};