import { AuthForm } from "@/components/auth/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Page Login chargée');
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session dans Login:', session);
      if (session) {
        console.log('Utilisateur connecté, redirection vers tableau-de-bord');
        navigate('/tableau-de-bord');
      } else {
        console.log('Aucune session, affichage du formulaire de connexion');
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm defaultIsSignUp={false} />
      </div>
    </div>
  );
};

export default Login;