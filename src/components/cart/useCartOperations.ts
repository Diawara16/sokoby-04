import { supabase } from '@/lib/supabase';
import { CartItem } from '@/types/cart';

type CartItemResponse = {
  id: string;
  product_id: string;
  quantity: number;
  products: {
    name: string;
    price: number;
    image: string | null;
  };
};

export const useCartOperations = () => {
  const loadCartItems = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: cartItems } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        products (
          name,
          price,
          image
        )
      `)
      .eq('user_id', session.user.id);

    if (!cartItems) return null;

    return (cartItems as CartItemResponse[]).map((item) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.products?.name ?? '',
      price: item.products?.price ?? 0,
      image: item.products?.image ?? null,
    }));
  };

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