export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  description?: string | null;
  category?: string | null;
  stock_quantity?: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}