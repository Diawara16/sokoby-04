export type PlatformStatus = 'pending' | 'unavailable' | 'coming_soon';

export interface PlatformConfig {
  name: string;
  icon: React.ReactNode;
  description: string;
  status: PlatformStatus;
  message: string;
}