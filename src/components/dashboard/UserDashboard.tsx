import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { TrialStatus } from "./TrialStatus";
import { FeatureUsage } from "./FeatureUsage";
import { Recommendations } from "./Recommendations";

interface UserProfile {
  trial_ends_at: string | null;
  features_usage: Record<string, number>;
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

  const hasFeatures = profile?.features_usage ? Object.keys(profile.features_usage).length > 0 : false;

  return (
    <div className="space-y-6">
      <TrialStatus trialEndsAt={profile?.trial_ends_at} />
      
      <div className="grid md:grid-cols-2 gap-8">
        <FeatureUsage features={profile?.features_usage || {}} />
        <Recommendations 
          daysRemaining={getDaysRemaining()} 
          hasFeatures={hasFeatures}
        />
      </div>
    </div>
  );
};