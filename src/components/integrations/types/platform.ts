import { ReactNode } from 'react';

export interface PlatformConfig {
  name: string;
  icon: ReactNode;
  description: string;
  status: 'pending' | 'active' | 'error' | 'coming_soon' | 'unavailable';
  features?: string[];
  message?: string;
}