import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { translations } from "@/translations";
import { useAuthForm } from "@/hooks/useAuthForm";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { AuthFormContent } from "./AuthFormContent";
import { sendVerificationEmail } from "./EmailVerification";

interface AuthFormProps {
  defaultIsSignUp?: boolean;
  onCancel?: () => void;
}

export function AuthForm({ defaultIsSignUp = true, onCancel }: AuthFormProps) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('currentLanguage') || 'fr';
  });
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isSignUp,
    setIsSignUp,
    handleSubmit,
    error,
  } = useAuthForm(defaultIsSignUp);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentLanguage') {
        setCurrentLanguage(event.newValue || 'fr');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !session.user.email_confirmed_at) {
        navigate('/verify-email');
      }
    };

    checkSession();
  }, [navigate]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
    
    if (isSignUp) {
      const success = await sendVerificationEmail(email);
      if (success) {
        navigate('/verify-email');
      }
    }
  };

  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isSignUp ? t.auth.createAccount : "Se connecter"}</CardTitle>
        <CardDescription>
          {isSignUp ? t.auth.trialDescription : "Connectez-vous à votre compte"}
        </CardDescription>
      </CardHeader>
      <AuthFormContent
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
        error={error}
        onSubmit={handleFormSubmit}
        onCancel={onCancel}
        currentLanguage={currentLanguage}
      />
    </Card>
  );
}