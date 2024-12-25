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
  const { fetchCartItems } = useCartOperations();

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

  return (
    <CartContext.Provider value={{ state, dispatch }}>
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