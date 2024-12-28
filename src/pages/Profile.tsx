import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Page en construction...</p>
      </div>
    </div>
  );
};

export default Profile;