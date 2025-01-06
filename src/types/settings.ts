export interface PaymentSettings {
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  apiKeys: {
    stripePublicKey?: string;
    stripeSecretKey?: string;
    paypalClientId?: string;
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  allowedIPs: string[];
}

export interface LocationSettings {
  address: string;
  city: string;
  country: string;
  postalCode: string;
  deliveryZones: {
    id: string;
    name: string;
    radius: number;
  }[];
}