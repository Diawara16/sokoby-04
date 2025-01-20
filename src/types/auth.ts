export interface User {
  id: string;
  email: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  aud: string;
  created_at: string;
  updated_at: string;
  role: string;
  aal?: string;
  amr?: Array<{
    method: string;
    timestamp: number;
  }>;
  session_id?: string;
  phone?: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  identities?: Array<{
    id: string;
    user_id: string;
    identity_data: {
      email: string;
      sub: string;
    };
    provider: string;
    created_at: string;
    updated_at: string;
  }>;
}