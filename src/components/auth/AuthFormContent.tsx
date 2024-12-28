import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { translations } from "@/translations";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";

interface AuthFormContentProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
  error: string | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel?: () => void;
  currentLanguage: string;
}

export function AuthFormContent({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  isSignUp,
  setIsSignUp,
  error,
  onSubmit,
  onCancel,
  currentLanguage,
}: AuthFormContentProps) {
  const t = translations[currentLanguage as keyof typeof translations];

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
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
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          {t.auth.continueWithGoogle}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700" 
          disabled={isLoading}
        >
          {isLoading ? (isSignUp ? t.auth.creating : t.auth.signingIn) : (isSignUp ? t.auth.create : t.auth.signIn)}
        </Button>
        <div className="flex gap-2 w-full">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-center text-red-600 hover:text-red-700 hover:underline"
          >
            {isSignUp ? t.auth.alreadyHaveAccount : t.auth.createAccount}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-center text-gray-500 hover:text-gray-700 hover:underline ml-auto"
            >
              {t.auth.back}
            </button>
          )}
        </div>
      </CardFooter>
    </form>
  );
}