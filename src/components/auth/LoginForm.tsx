import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSignIn } from "@/hooks/auth/useSignIn";
import { SocialAuthButtons } from "./SocialAuthButtons";

interface LoginFormProps {
  onCancel?: () => void;
}

export function LoginForm({ onCancel }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, handleSignIn } = useSignIn();

  console.log("LoginForm component loaded - NOUVEAU COMPOSANT DE CONNEXION");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, password);
  };

  return (
    <Card className="w-full max-w-none bg-white shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">
          Se connecter
        </CardTitle>
        <CardDescription className="text-gray-600">
          Connectez-vous à votre compte
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>

          <div className="text-center">
            <Link
              to="/mot-de-passe-oublie"
              className="text-sm text-[#ea384c] hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <div className="text-center text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link
              to="/inscription"
              className="text-[#ea384c] hover:underline font-medium"
            >
              Créer un compte
            </Link>
          </div>

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full"
            >
              Annuler
            </Button>
          )}
        </form>
      </div>
    </Card>
  );
}