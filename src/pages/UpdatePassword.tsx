import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuthAndProfile();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/connexion');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Vérifier le mot de passe actuel en tentant une reconnexion
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error("Utilisateur non connecté");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Mot de passe actuel incorrect");
      }

      // Mettre à jour le mot de passe
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });

      // Réinitialiser le formulaire
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      navigate('/tableau-de-bord');
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full max-w-none bg-white shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Modifier le mot de passe
            </CardTitle>
            <CardDescription className="text-gray-600">
              Changez votre mot de passe actuel
            </CardDescription>
          </CardHeader>

          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Entrez votre mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre nouveau mot de passe"
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

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => navigate('/tableau-de-bord')}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Retour au tableau de bord
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdatePassword;