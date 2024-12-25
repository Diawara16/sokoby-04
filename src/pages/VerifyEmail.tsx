import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const VerifyEmail = () => {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }
      
      if (session.user.email_confirmed_at) {
        navigate('/onboarding');
        return;
      }
      
      setEmail(session.user.email);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
      if (session?.user.email_confirmed_at) {
        navigate('/onboarding');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Vérifiez votre email</CardTitle>
          <CardDescription>
            Nous avons envoyé un lien de confirmation à {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            Veuillez cliquer sur le lien dans l'email pour vérifier votre adresse et continuer la configuration de votre compte.
          </p>
          <p className="text-xs text-gray-400">
            Si vous ne trouvez pas l'email, vérifiez votre dossier spam.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;