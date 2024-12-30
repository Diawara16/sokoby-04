import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";

interface CartTriggerProps {
  itemCount: number;
  isLoading: boolean;
}

export const CartTrigger = ({ itemCount, isLoading }: CartTriggerProps) => {
  if (isLoading) {
    return (
      <Button variant="outline" size="icon" className="relative">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button variant="outline" size="icon" className="relative">
      <ShoppingCart className="h-4 w-4" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  );
};