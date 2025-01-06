import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ProfileForm } from "@/components/profile/ProfileForm";
import SubscriptionDetails from "@/components/profile/SubscriptionDetails";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("Utilisateur non connecté, redirection vers la page d'accueil");
        navigate("/");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>
        
        <div className="space-y-8">
          <SubscriptionDetails />
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;