import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { translations } from "@/translations";
import { useAuthForm } from "@/hooks/useAuthForm";

export function AuthForm() {
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
  } = useAuthForm();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentLanguage') {
        setCurrentLanguage(event.newValue || 'fr');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isSignUp ? t.auth.createAccount : "Se connecter"}</CardTitle>
        <CardDescription>
          {isSignUp ? t.auth.trialDescription : "Connectez-vous à votre compte"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-center text-red-600 hover:text-red-700 hover:underline"
          >
            {isSignUp ? "Déjà un compte ? Se connecter" : "S'inscrire"}
          </button>
        </CardFooter>
      </form>
    </Card>
  );
}