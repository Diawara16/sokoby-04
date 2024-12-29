import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { TrialStatus } from "./TrialStatus";
import { FeatureUsage } from "./FeatureUsage";
import { Recommendations } from "./Recommendations";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Settings, Users } from "lucide-react";

interface UserProfile {
  trial_ends_at: string | null;
  features_usage: Record<string, number>;
  last_login: string | null;
}

interface DashboardMetric {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export const UserDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
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

        // Charger les métriques du tableau de bord
        const { data: cartItems } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id);

        const dashboardMetrics: DashboardMetric[] = [
          {
            title: "Produits en panier",
            value: String(cartItems?.length || 0),
            description: "Nombre total de produits dans votre panier",
            icon: <ShoppingBag className="h-6 w-6 text-muted-foreground" />,
          },
          {
            title: "Fonctionnalités utilisées",
            value: String(Object.keys(data?.features_usage || {}).length),
            description: "Nombre de fonctionnalités que vous utilisez",
            icon: <Settings className="h-6 w-6 text-muted-foreground" />,
          },
          {
            title: "Dernière connexion",
            value: data?.last_login ? format(new Date(data.last_login), "dd/MM/yyyy", { locale: fr }) : "Jamais",
            description: "Date de votre dernière connexion",
            icon: <Users className="h-6 w-6 text-muted-foreground" />,
          },
        ];

        setMetrics(dashboardMetrics);
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
    return Math.max(0, differenceInDays(new Date(profile.trial_ends_at), new Date()));
  };

  const hasFeatures = profile?.features_usage ? Object.keys(profile.features_usage).length > 0 : false;

  return (
    <div className="space-y-6">
      <TrialStatus trialEndsAt={profile?.trial_ends_at} />
      
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FeatureUsage features={profile?.features_usage || {}} />
        <Recommendations 
          daysRemaining={getDaysRemaining()} 
          hasFeatures={hasFeatures}
        />
      </div>
    </div>
  );
};