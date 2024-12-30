import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartReducer } from './cartReducer';
import { CartItem, CartContextType, CartState } from '@/types/cart';
import { useCartOperations } from './useCartOperations';
import { supabase } from '@/lib/supabase';

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  total: 0,
  isLoading: true
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { fetchCartItems, addToCart, removeFromCart: removeItem, updateCartItemQuantity } = useCartOperations();

  const initializeCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const items = await fetchCartItems();
        dispatch({ type: 'SET_ITEMS', payload: items });
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    initializeCart();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        initializeCart();
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'CLEAR_CART' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addItemToCart = async (productId: string, quantity: number = 1) => {
    const result = await addToCart(productId, quantity);
    if (result) {
      await initializeCart(); // Recharger le panier pour avoir les données à jour
    }
  };

  const removeFromCart = async (id: string) => {
    const success = await removeItem(id);
    if (success) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const success = await updateCartItemQuantity(id, quantity);
    if (success) {
      if (quantity <= 0) {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
      } else {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      }
    }
  };

  const clearCart = async () => {
    // Implémenter la logique de suppression dans Supabase si nécessaire
    dispatch({ type: 'CLEAR_CART' });
  };

  const value = {
    state,
    dispatch,
    addItemToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};