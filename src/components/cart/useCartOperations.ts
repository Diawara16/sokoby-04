import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { CartItem } from '@/types/cart';

interface Product {
  name: string;
  price: number;
  image: string;
}

interface CartItemResponse {
  id: string;
  product_id: string;
  quantity: number;
  products: Product;
}

export const useCartOperations = (userId: string | undefined) => {
  const { toast } = useToast();

  const loadCartItems = useCallback(async () => {
    if (!userId) return null;

    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading cart items:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le panier',
        variant: 'destructive',
      });
      return null;
    }

    if (!cartItems) return null;

    return cartItems.map((item: CartItemResponse) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.products.name,
      price: item.products.price,
      image: item.products.image,
    }));
  }, [userId, toast]);

  const addCartItem = async (item: Omit<CartItem, 'id'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        product_id: item.product_id,
        quantity: item.quantity,
        user_id: session.user.id,
      })
      .select()
      .single();

    if (error) return null;
    return data;
  };

  const removeCartItem = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    return !error;
  };

  const updateCartItemQuantity = async (id: string, quantity: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', session.user.id);

    return !error;
  };

  const clearCart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', session.user.id);

    return !error;
  };

  return {
    loadCartItems,
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    clearCart,
  };
};
