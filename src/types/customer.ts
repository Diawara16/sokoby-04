export interface CustomerTag {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface CustomerTagRelation {
  customer_id: string;
  tag_id: string;
  created_at: string;
}

export interface CustomerDetails {
  id: string;
  user_id: string | null;
  full_name: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postal_code: string | null;
  company_name: string | null;
  notes: string | null;
  customer_type: string | null;
  total_orders: number | null;
  total_spent: number | null;
  last_purchase_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  tags?: CustomerTag[];
}