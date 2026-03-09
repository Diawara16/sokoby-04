import { useState } from "react";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, CreditCard, LogOut, Trash2, Clock } from "lucide-react";

export default function GestionCompte() {
  const { isAuthenticated, isLoading, session, hasPaidAccess, accessLevel, accessDaysLeft } = useAuthAndProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <p className="text-muted-foreground">Chargement du compte...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/connexion");
    return null;
  }

  const userEmail = session?.user?.email || "";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: "Déconnexion réussie", description: "Vous avez été déconnecté avec succès." });
      navigate("/");
    } catch {
      toast({ title: "Erreur", description: "Erreur lors de la déconnexion.", variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await supabase.auth.signOut();
      toast({ title: "Déconnexion réussie", description: "Pour supprimer définitivement vos données, contactez le support." });
      navigate("/");
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Gestion du compte</h1>
          <p className="text-muted-foreground">Gérez votre compte et vos préférences</p>
        </div>

        {/* Account Status — reads from stores.plan via accessLevel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Statut du compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium">Email: {userEmail}</p>

            {hasPaidAccess ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan</span>
                <Badge variant="default">Abonnement actif</Badge>
              </div>
            ) : accessLevel === "trial" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Période d'essai</span>
                  <Badge variant="secondary">{accessDaysLeft ?? 0} jours restants</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Statut</span>
                  <Badge variant="destructive">Aucun abonnement</Badge>
                </div>
                <Button onClick={() => navigate("/creer-boutique-ia")} className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Créer une boutique IA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions du compte</CardTitle>
            <CardDescription>Gérez votre compte et vos données</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
            <Button variant="outline" onClick={() => navigate("/parametres")} className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Paramètres du compte
            </Button>

            {!showDeleteConfirm ? (
              <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="w-full justify-start">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer mon compte
              </Button>
            ) : (
              <Card className="border-destructive">
                <CardContent className="pt-4">
                  <p className="text-sm text-destructive font-medium mb-3">Êtes-vous sûr ?</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)} className="flex-1">Annuler</Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteAccount} disabled={isDeleting} className="flex-1">
                      {isDeleting ? "Suppression..." : "Confirmer"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Besoin d'aide ?</CardTitle></CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/support")} className="w-full">Contacter le support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
