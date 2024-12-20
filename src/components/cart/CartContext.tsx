import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartState, CartItem } from '@/types/cart';
import { cartReducer } from './cartReducer';
import { useCartOperations } from './useCartOperations';
import { supabase } from '@/lib/supabase';

type CartContextType = {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const [userId, setUserId] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    getUserId();
  }, []);

  const { loadCartItems, addCartItem, removeCartItem, updateCartItemQuantity, clearCart: clearCartItems } = useCartOperations(userId);

  useEffect(() => {
    const initializeCart = async () => {
      const cartItems = await loadCartItems();
      if (cartItems) {
        dispatch({ type: 'SET_CART', payload: cartItems });
      }
    };

    if (userId) {
      initializeCart();
    }
  }, [userId]);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    const result = await addCartItem(item);
    if (result) {
      dispatch({
        type: 'ADD_ITEM',
        payload: { ...item, id: result.id },
      });
    }
  };

  const removeFromCart = async (id: string) => {
    const success = await removeCartItem(id);
    if (success) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const success = await updateCartItemQuantity(id, quantity);
    if (success) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, quantity },
      });
    }
  };

  const clearCart = async () => {
    const success = await clearCartItems();
    if (success) {
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};