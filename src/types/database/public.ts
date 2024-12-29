import { Referral } from '../referral';

export interface PublicSchema {
  Tables: {
    products: {
      Row: {
        id: string;
        name: string;
        price: number;
        image: string | null;
        created_at: string;
      };
      Insert: {
        id?: string;
        name: string;
        price: number;
        image?: string | null;
        created_at?: string;
      };
      Update: {
        id?: string;
        name?: string;
        price?: number;
        image?: string | null;
        created_at?: string;
      };
    };
    cart_items: {
      Row: {
        id: string;
        user_id: string;
        product_id: string;
        quantity: number;
        created_at: string;
      };
      Insert: {
        id?: string;
        user_id: string;
        product_id: string;
        quantity?: number;
        created_at?: string;
      };
      Update: {
        id?: string;
        user_id?: string;
        product_id?: string;
        quantity?: number;
        created_at?: string;
      };
    };
    referrals: {
      Row: Referral;
      Insert: Omit<Referral, 'id' | 'created_at' | 'converted_at'>;
      Update: Partial<Omit<Referral, 'id' | 'created_at'>>;
    };
  };
}