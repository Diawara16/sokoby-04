export type PlatformStatus = 'pending' | 'unavailable' | 'coming_soon' | 'active';

export interface PlatformConfig {
  name: string;
  icon: React.ReactNode;
  description: string;
  features?: string[];
  status: PlatformStatus;
  message: string;
}