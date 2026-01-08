export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  description?: string | null;
  category?: string | null;
  stock?: number;
  status?: string;
  user_id?: string;
  store_id?: string;
  is_visible?: boolean;
  published?: boolean;
  created_at: string;
}