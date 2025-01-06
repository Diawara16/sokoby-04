export interface StoreSettings {
  id: string;
  store_name: string;
  store_email: string | null;
  store_phone: string | null;
  store_address: string | null;
  domain_name: string | null;
  is_custom_domain: boolean;
  timezone: string | null;
  default_currency: string | null;
  default_language: string | null;
  vat_number: string | null;
  vat_rate: number | null;
  invoice_prefix: string | null;
  invoice_footer_text: string | null;
  invoice_legal_notice: string | null;
  invoice_template: Record<string, boolean>;
  email_template_order: {
    subject: string;
    header: string;
    footer: string;
  };
  email_template_invoice: {
    subject: string;
    header: string;
    footer: string;
  };
}

export interface StaffMember {
  id: string;
  invited_email: string;
  role: string;
  status: string;
  permissions: Record<string, any>;
  store_id: string;
  user_id: string;
}