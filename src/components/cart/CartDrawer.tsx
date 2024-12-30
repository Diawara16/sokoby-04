import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartTrigger } from './CartTrigger';
import { CartItem } from './CartItem';
import { CartFooter } from './CartFooter';

export const CartDrawer = () => {
  const { state, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <CartTrigger itemCount={itemCount} isLoading={state.isLoading} />
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Votre panier</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 mt-4">
            {state.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
            {state.items.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Votre panier est vide
              </div>
            )}
          </div>
        </ScrollArea>

        {state.items.length > 0 && (
          <CartFooter
            total={state.total}
            onCheckout={handleCheckout}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};