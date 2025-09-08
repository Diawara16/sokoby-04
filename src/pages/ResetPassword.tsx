import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Check if we have a PKCE code in the URL
        const code = searchParams.get('code');
        
        if (code) {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          
          if (error) {
            console.error("Erreur lors de l'échange du code:", error);
            toast({
              title: "Lien invalide",
              description: "Ce lien de réinitialisation n'est pas valide ou a expiré.",
              variant: "destructive",
            });
            navigate('/mot-de-passe-oublie');
            return;
          }
        } else {
          // Check if we have a valid session for password reset
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error || !session) {
            const urlError = searchParams.get('error');
            const errorDescription = searchParams.get('error_description');
            
            if (urlError) {
              console.error("Erreur dans l'URL:", urlError, errorDescription);
            }
            
            toast({
              title: "Lien invalide",
              description: errorDescription || "Ce lien de réinitialisation n'est pas valide ou a expiré.",
              variant: "destructive",
            });
            navigate('/mot-de-passe-oublie');
          }
        }
      } catch (error) {
        console.error("Erreur lors de la gestion du reset:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification du lien.",
          variant: "destructive",
        });
        navigate('/mot-de-passe-oublie');
      }
    };

    handlePasswordReset();
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });

      navigate('/connexion');
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du mot de passe.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full max-w-none bg-white shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Nouveau mot de passe
            </CardTitle>
            <CardDescription className="text-gray-600">
              Choisissez un nouveau mot de passe sécurisé
            </CardDescription>
          </CardHeader>

          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
              >
                {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;