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
  about_text: string | null;
  banner_url: string | null;
  enabled_languages: string[] | null;
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
  gdpr_settings: {
    cookie_consent_enabled: boolean;
    privacy_policy_url: string | null;
    cookie_duration_days: number;
    data_retention_months: number;
  };
  display_settings: {
    date_format: string;
    products_per_page: number;
    show_out_of_stock: boolean;
    show_low_stock_warning: boolean;
    low_stock_threshold: number;
  };
  social_media: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    youtube: string | null;
  };
  notification_settings: {
    order_updates: boolean;
    stock_alerts: boolean;
    marketing_emails: boolean;
    security_alerts: boolean;
    newsletter: boolean;
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