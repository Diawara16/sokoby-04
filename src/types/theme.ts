export interface ThemeColors {
  primary: string;
  secondary: string;
  accent?: string;
  background?: string;
  text?: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: string;
  headingFont?: string;
  bodyFont?: string;
}

export interface ThemeLayout {
  spacing: string;
  containerWidth: string;
  borderRadius?: string;
}

export interface ThemeComponents {
  buttons?: {
    borderRadius?: string;
    padding?: string;
  };
  cards?: {
    borderRadius?: string;
    shadow?: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  niche: string;
  preview_url?: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  components: ThemeComponents;
  created_at: string;
}