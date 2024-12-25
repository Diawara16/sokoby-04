import { CartState, CartAction } from '@/types/cart';

export const cartReducer = (state: CartState, action: CartAction): CartState => {
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
        ...state,
        items: [],
        total: 0,
      };

    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};