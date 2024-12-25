import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { translations } from "@/translations";

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
  );
}