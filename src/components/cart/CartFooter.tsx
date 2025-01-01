import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartFooterProps {
  total: number;
  onCheckout: () => void;
}

export const CartFooter = ({ total, onCheckout }: CartFooterProps) => {
  return (
    <div className="mt-auto pt-4">
      <Separator className="my-4" />
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">Sous-total</span>
          <span className="font-medium">${total.toFixed(2)}</span>
        </div>
        <Button className="w-full" onClick={onCheckout}>
          Passer à la caisse
        </Button>
      </div>
    </div>
  );
};