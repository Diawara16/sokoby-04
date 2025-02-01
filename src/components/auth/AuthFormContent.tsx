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
  dateOfBirth: string;
  setDateOfBirth: (date: string) => void;
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
  dateOfBirth,
  setDateOfBirth,
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
    <form onSubmit={onSubmit} className="space-y-4">
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
            placeholder="nom@entreprise.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>

        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date de naissance</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="w-full"
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-gray-500">
              Vous devez avoir au moins 18 ans pour créer une boutique
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700 text-white" 
          disabled={isLoading}
        >
          {isLoading 
            ? (isSignUp ? "Création en cours..." : "Connexion en cours...") 
            : (isSignUp ? "Commencer l'essai gratuit" : "Se connecter")}
        </Button>

        <div className="text-center text-sm text-gray-600">
          {isSignUp ? (
            <p>
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-red-600 hover:text-red-700 hover:underline"
              >
                Se connecter
              </button>
            </p>
          ) : (
            <p>
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-red-600 hover:text-red-700 hover:underline"
              >
                Créer un compte
              </button>
            </p>
          )}
        </div>

        <p className="text-xs text-center text-gray-500">
          En continuant, vous acceptez les{" "}
          <a href="/conditions" className="text-red-600 hover:text-red-700 hover:underline">
            conditions générales
          </a>{" "}
          et la{" "}
          <a href="/confidentialite" className="text-red-600 hover:text-red-700 hover:underline">
            politique de confidentialité
          </a>
        </p>
      </CardFooter>
    </form>
  );
}