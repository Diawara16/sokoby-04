import { RegisterForm } from "@/components/auth/RegisterForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/tableau-de-bord');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de vérifier votre session. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    };
    checkSession();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;