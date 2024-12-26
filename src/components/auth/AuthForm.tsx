import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { translations } from "@/translations";
import { useAuthForm } from "@/hooks/useAuthForm";
import { AuthFormContent } from "./AuthFormContent";

interface AuthFormProps {
  defaultIsSignUp?: boolean;
  onCancel?: () => void;
}

export function AuthForm({ defaultIsSignUp = true, onCancel }: AuthFormProps) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('currentLanguage') || 'fr';
  });

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
        onSubmit={handleSubmit}
        onCancel={onCancel}
        currentLanguage={currentLanguage}
      />
    </Card>
  );
}