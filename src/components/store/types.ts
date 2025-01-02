export interface StoreSettings {
  id: string;
  store_name: string;
  store_email: string | null;
  store_phone: string | null;
  store_address: string | null;
  domain_name: string | null;
  is_custom_domain: boolean;
}