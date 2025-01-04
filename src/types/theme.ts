export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface ThemeTemplate {
  id: string;
  name: string;
  description?: string;
  niche: string;
  preview_url?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  layout: {
    style: string;
    spacing: string;
  };
  components?: Record<string, unknown>;
}

export type Theme = {
  name: string;
  description: string;
  features: string[];
  preview: string;
  colors: ThemeColors;
  price?: number;
}

export type BackgroundColor = string;