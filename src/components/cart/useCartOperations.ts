import { supabase } from '@/lib/supabase';
import { CartItem } from '@/types/cart';

export const useCartOperations = () => {
  const fetchCartItems = async (): Promise<CartItem[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product:product_id (
            id,
            name,
            price,
            image
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  };

  return {
    fetchCartItems
  };
};