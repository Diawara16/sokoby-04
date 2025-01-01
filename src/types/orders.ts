export interface Address {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  product: {
    name: string;
    image: string | null;
  };
}

export interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address: Address | null;
  billing_address: Address | null;
  items: OrderItem[];
}