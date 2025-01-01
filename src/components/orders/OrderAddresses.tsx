import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Address } from '@/types/orders';

interface OrderAddressesProps {
  shippingAddress: Address | null;
  billingAddress: Address | null;
}

export const OrderAddresses = ({ shippingAddress, billingAddress }: OrderAddressesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {shippingAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Adresse de livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{shippingAddress.street}</p>
            <p>
              {shippingAddress.postal_code} {shippingAddress.city}
            </p>
            <p>{shippingAddress.country}</p>
          </CardContent>
        </Card>
      )}

      {billingAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Adresse de facturation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{billingAddress.street}</p>
            <p>
              {billingAddress.postal_code} {billingAddress.city}
            </p>
            <p>{billingAddress.country}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};