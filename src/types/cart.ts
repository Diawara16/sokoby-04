export type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
};

export type CartState = {
  items: CartItem[];
  total: number;
  isLoading: boolean;
};

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean };

export type CartContextType = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItemToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
};