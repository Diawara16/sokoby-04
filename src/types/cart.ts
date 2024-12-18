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
};

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };