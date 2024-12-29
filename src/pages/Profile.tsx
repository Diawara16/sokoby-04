import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ProfileForm } from "@/components/profile/ProfileForm";

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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-md mx-auto p-6">
        <ProfileForm />
      </div>
    </div>
  );
};

export default Profile;