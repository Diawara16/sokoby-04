import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '@/types/cart';

const initialState: CartState = {
  items: [],
  total: 0,
  isLoading: true
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total += action.payload.price * action.payload.quantity;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (itemToRemove) {
        state.total -= itemToRemove.price * itemToRemove.quantity;
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        const quantityDiff = action.payload.quantity - item.quantity;
        state.total += item.price * quantityDiff;
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setItems, addItem, removeItem, updateQuantity, clearCart, setLoading } = cartSlice.actions;
export default cartSlice.reducer;