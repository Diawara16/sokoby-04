import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { translations } from "@/translations";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.functions.invoke('send-verification-email', {
            body: {
              email: email,
              confirmationUrl: `${window.location.origin}/verify-email`,
            },
          });
          navigate('/verify-email');
        }
      } catch (error) {
        console.error('Error sending verification email:', error);
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
      <form onSubmit={handleFormSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={t.auth.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t.auth.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700" 
            disabled={isLoading}
          >
            {isLoading ? (isSignUp ? t.auth.creating : "Connexion en cours...") : (isSignUp ? t.auth.create : "Se connecter")}
          </Button>
          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-center text-red-600 hover:text-red-700 hover:underline"
            >
              {isSignUp ? "Déjà un compte ? Se connecter" : "Créer un compte"}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-sm text-center text-gray-500 hover:text-gray-700 hover:underline ml-auto"
              >
                Retour
              </button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}