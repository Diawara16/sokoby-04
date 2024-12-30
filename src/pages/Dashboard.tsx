import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { TrialStatus } from "@/components/dashboard/TrialStatus";
import { FeatureUsage } from "@/components/dashboard/FeatureUsage";
import { Recommendations } from "@/components/dashboard/Recommendations";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("Utilisateur non connecté, redirection vers la page d'accueil");
        navigate("/");
        return;
      }

      // Charger le profil de l'utilisateur
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(userProfile);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getDaysRemaining = () => {
    if (!profile?.trial_ends_at) return 0;
    const daysRemaining = Math.max(0, Math.floor((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    return daysRemaining;
  };

  const hasFeatures = profile?.features_usage ? Object.keys(profile.features_usage).length > 0 : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez votre boutique et suivez vos performances
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <TrialStatus trialEndsAt={profile?.trial_ends_at} />
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Navigation rapide
              </h2>
              <DashboardNavigation />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureUsage features={profile?.features_usage || {}} />
            <Recommendations 
              daysRemaining={getDaysRemaining()} 
              hasFeatures={hasFeatures}
            />
          </div>

          <UserDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;