import { useState } from "react";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Calendar, CreditCard, LogOut, Trash2, Clock } from "lucide-react";

export default function GestionCompte() {
  const { isAuthenticated, session, profile } = useAuthAndProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isAuthenticated) {
    navigate("/connexion");
    return null;
  }

  const userEmail = session?.user?.email || "";
  
  // Check trial status
  const isTrialExpired = profile?.trial_ends_at 
    ? new Date(profile.trial_ends_at) < new Date()
    : false;
    
  const daysRemaining = profile?.trial_ends_at 
    ? Math.max(0, Math.floor((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const trialProgress = ((14 - daysRemaining) / 14) * 100;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Just sign out for now - account deletion would need to be implemented server-side
      await supabase.auth.signOut();

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté. Pour supprimer définitivement vos données, contactez le support.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return "Date invalide";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Gestion du compte</h1>
          <p className="text-muted-foreground">
            Gérez votre compte et vos préférences
          </p>
        </div>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Statut du compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Email: {userEmail}</p>
            </div>
            
            {profile?.trial_ends_at && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Période d'essai</span>
                  <Badge variant={isTrialExpired ? "destructive" : "secondary"}>
                    {isTrialExpired ? "Expiré" : `${daysRemaining} jours restants`}
                  </Badge>
                </div>
                <Progress value={trialProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {isTrialExpired 
                    ? `Essai gratuit expiré le ${formatDate(profile.trial_ends_at)}`
                    : `Se termine le ${formatDate(profile.trial_ends_at)}`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trial Expired Warning */}
        {isTrialExpired && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Essai gratuit expiré
              </CardTitle>
              <CardDescription>
                Votre période d'essai de 14 jours est terminée. Choisissez une option ci-dessous.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Button onClick={() => navigate("/plan-tarifaire")} className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Choisir un plan payant
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/profil")} 
                  className="w-full"
                >
                  Voir mon profil
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions du compte</CardTitle>
            <CardDescription>
              Gérez votre compte et vos données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/parametres")}
              className="w-full justify-start"
            >
              <Clock className="mr-2 h-4 w-4" />
              Paramètres du compte
            </Button>

            {!showDeleteConfirm ? (
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full justify-start"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer mon compte
              </Button>
            ) : (
              <Card className="border-destructive">
                <CardContent className="pt-4">
                  <p className="text-sm text-destructive font-medium mb-3">
                    Êtes-vous sûr de vouloir supprimer votre compte ?
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Cette action supprimera définitivement toutes vos données.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      {isDeleting ? "Suppression..." : "Confirmer"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Besoin d'aide ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Si vous avez des questions ou des problèmes, n'hésitez pas à nous contacter.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate("/support")}
              className="w-full"
            >
              Contacter le support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}