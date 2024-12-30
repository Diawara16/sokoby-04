import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  email: string | null;
  trial_ends_at: string | null;
  features_usage: Record<string, number>;
  last_login: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("Utilisateur non connecté, redirection vers la page d'accueil");
          navigate("/");
          return;
        }

        // Vérifier si l'utilisateur a un profil
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la récupération du profil:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger votre profil",
            variant: "destructive",
          });
          return;
        }

        if (!profileData) {
          console.log("Profil non trouvé, redirection vers l'onboarding");
          navigate("/onboarding");
          return;
        }

        setProfile(profileData);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement de votre tableau de bord",
          variant: "destructive",
        });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez votre boutique et suivez vos performances
          </p>
        </div>

        <div className="space-y-8">
          <UserDashboard />
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Navigation rapide
            </h2>
            <DashboardNavigation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;