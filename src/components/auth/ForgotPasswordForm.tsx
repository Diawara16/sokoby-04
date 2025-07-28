import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Utiliser temporairement le système d'email de Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte email pour réinitialiser votre mot de passe.",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-none bg-white shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-green-600">
            Email envoyé
          </CardTitle>
          <CardDescription className="text-gray-600">
            Nous avons envoyé un lien de réinitialisation à votre adresse email
          </CardDescription>
        </CardHeader>

        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Vérifiez votre boîte email et cliquez sur le lien pour réinitialiser votre mot de passe.
            </p>
            <p className="text-xs text-gray-500">
              N'oubliez pas de vérifier vos dossiers de spam.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/connexion"
              className="text-[#ea384c] hover:underline font-medium"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-none bg-white shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">
          Mot de passe oublié ?
        </CardTitle>
        <CardDescription className="text-gray-600">
          Entrez votre email pour recevoir un lien de réinitialisation
        </CardDescription>
      </CardHeader>

      <div className="p-6 space-y-6">
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
          >
            {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
          </Button>

          <div className="text-center">
            <Link
              to="/connexion"
              className="text-sm text-gray-600 hover:underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </Card>
  );
}