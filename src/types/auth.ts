export type AuthFormState = {
  email: string;
  password: string;
  isLoading: boolean;
  isSignUp: boolean;
};

export type AuthFormActions = {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setIsSignUp: (isSignUp: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

export type UseAuthForm = AuthFormState & AuthFormActions;