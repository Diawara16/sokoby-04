import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSignUp } from "@/hooks/auth/useSignUp";
import { SocialAuthButtons } from "./SocialAuthButtons";

interface RegisterFormProps {
  onCancel?: () => void;
}

export function RegisterForm({ onCancel }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Removed dateOfBirth state to simplify registration
  const { isLoading, error, handleSignUp } = useSignUp();

  console.log("RegisterForm component loaded - NOUVEAU COMPOSANT D'INSCRIPTION");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignUp(email, password);
  };

  return (
    <Card className="w-full max-w-none bg-white shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">
          Commencez votre essai gratuit
        </CardTitle>
        <CardDescription className="text-gray-600">
          Obtenez 14 jours gratuits, puis 1 mois pour 1€
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
              placeholder="Minimum 8 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {/* Removed date of birth field to simplify registration */}

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
            {isLoading ? "Création du compte..." : "Créer mon compte"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Déjà un compte ?{" "}
            <Link
              to="/connexion"
              className="text-[#ea384c] hover:underline font-medium"
            >
              Se connecter
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

          <div className="text-xs text-gray-500 text-center">
            En créant un compte, vous acceptez nos{" "}
            <Link to="/conditions" className="underline">
              conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link to="/confidentialite" className="underline">
              politique de confidentialité
            </Link>
          </div>
        </form>
      </div>
    </Card>
  );
}