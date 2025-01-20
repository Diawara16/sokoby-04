import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser;

export type AuthFormState = {
  email: string;
  password: string;
  isLoading: boolean;
  isSignUp: boolean;
  error: string | null;
};

export type AuthFormActions = {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setIsSignUp: (isSignUp: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

export type UseAuthForm = AuthFormState & AuthFormActions;