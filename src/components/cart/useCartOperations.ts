import { supabase } from '@/lib/supabase';
import { CartItem } from '@/types/cart';
import { useToast } from '@/hooks/use-toast';

export const useCartOperations = () => {
  const { toast } = useToast();

  const fetchCartItems = async (): Promise<CartItem[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product:products!inner (
            id,
            name,
            price,
            image
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        product_id: item.product.id,
        quantity: item.quantity,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image
      }));
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter au panier",
          variant: "destructive",
        });
        return null;
      }

      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Quantité mise à jour dans le panier",
        });
        
        return data;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert([
          {
            user_id: user.id,
            product_id: productId,
            quantity
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Produit ajouté au panier",
      });

      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter au panier",
        variant: "destructive",
      });
      return null;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Produit retiré du panier",
      });

      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(cartItemId);
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Quantité mise à jour",
      });

      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    fetchCartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity
  };
};