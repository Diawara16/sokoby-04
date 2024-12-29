import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Clock, Activity, Star } from "lucide-react";

interface UserProfile {
  trial_ends_at: string | null;
  features_usage: any;
  last_login: string | null;
}

export const UserDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour accéder à votre tableau de bord",
            variant: "destructive",
          });
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du profil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getDaysRemaining = () => {
    if (!profile?.trial_ends_at) return 0;
    const daysRemaining = differenceInDays(new Date(profile.trial_ends_at), new Date());
    return Math.max(0, daysRemaining);
  };

  const daysRemaining = getDaysRemaining();
  const trialProgress = ((14 - daysRemaining) / 14) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Statut de votre période d'essai
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.trial_ends_at ? (
            <div className="space-y-4">
              <Progress value={trialProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Il vous reste {daysRemaining} jours d'essai gratuit
                {daysRemaining > 0 && ` (se termine le ${format(new Date(profile.trial_ends_at), "d MMMM yyyy", { locale: fr })})`}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Période d'essai terminée
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Utilisation des fonctionnalités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile?.features_usage ? (
                Object.entries(profile.features_usage).map(([feature, count]) => (
                  <div key={feature} className="flex justify-between items-center">
                    <span className="text-sm">{feature}</span>
                    <span className="text-sm font-medium">{count} utilisations</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune utilisation enregistrée
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {daysRemaining <= 3 && (
                <p className="text-sm text-amber-600">
                  Votre période d'essai se termine bientôt. Pensez à souscrire à un abonnement pour continuer à utiliser nos services.
                </p>
              )}
              {!profile?.features_usage && (
                <p className="text-sm text-muted-foreground">
                  Explorez nos différentes fonctionnalités pour tirer le meilleur parti de votre période d'essai !
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};