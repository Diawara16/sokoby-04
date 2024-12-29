import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { translations } from "@/translations";
import { useAuthForm } from "@/hooks/useAuthForm";
import { AuthFormContent } from "./AuthFormContent";
import { SocialAuthButtons } from "./SocialAuthButtons";

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
    <Card className="w-full max-w-md bg-white shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">
          {isSignUp ? "Commencez votre essai gratuit" : "Se connecter"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {isSignUp 
            ? "Obtenez 14 jours gratuits, puis 1 mois pour 1€" 
            : "Connectez-vous à votre compte"}
        </CardDescription>
      </CardHeader>

      <div className="p-6 space-y-6">
        <SocialAuthButtons />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">ou</span>
          </div>
        </div>

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
      </div>
    </Card>
  );
}