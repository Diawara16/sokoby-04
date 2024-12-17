import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
  total: number;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product_id === action.payload.product_id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + (action.payload.price * action.payload.quantity),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + (action.payload.price * action.payload.quantity),
      };

    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.id) {
            const quantityDiff = action.payload.quantity - item.quantity;
            state.total += item.price * quantityDiff;
            return { ...item, quantity: action.payload.quantity };
          }
          return item;
        }),
      };

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
      };

    case 'SET_CART':
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  useEffect(() => {
    const loadCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
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
          `);

        if (cartItems) {
          const formattedItems = cartItems.map(item => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            name: item.products.name,
            price: item.products.price,
            image: item.products.image,
          }));
          dispatch({ type: 'SET_CART', payload: formattedItems });
        }
      }
    };

    loadCart();
  }, []);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          product_id: item.product_id,
          quantity: item.quantity,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (!error && data) {
        dispatch({
          type: 'ADD_ITEM',
          payload: { ...item, id: data.id },
        });
      }
    }
  };

  const removeFromCart = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (!error) {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id);

      if (!error) {
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: { id, quantity },
        });
      }
    }
  };

  const clearCart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id);

      if (!error) {
        dispatch({ type: 'CLEAR_CART' });
      }
    }
  };

  return (
    <CartContext.Provider
      value={{ state, dispatch, addToCart, removeFromCart, updateQuantity, clearCart }}
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