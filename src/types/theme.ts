export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface Theme {
  name: string;
  description: string;
  features: string[];
  preview: string;
  colors: ThemeColors;
}