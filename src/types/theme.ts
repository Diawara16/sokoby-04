export interface PricingPlanData {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface ThemeTypography {
  heading: string;
  body: string;
}

export interface ThemeLayout {
  style: string;
  spacing: string;
}

export interface Theme {
  id?: string;
  name: string;
  description: string;
  features: string[];
  preview: string;
  colors: ThemeColors;
  price: number;
}

export interface ThemeTemplate {
  id: string;
  name: string;
  description?: string;
  niche: string;
  preview_url?: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  components: Record<string, any>;
}