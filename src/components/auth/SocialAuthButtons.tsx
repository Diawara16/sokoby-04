import { Button } from "@/components/ui/button";
import { Apple, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const SocialAuthButtons = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const redirectURL = `${window.location.origin}/onboarding`;
  
  console.log("Configuration de l'URL de redirection:", redirectURL);

  const handleAuthResponse = (error: any, provider: string) => {
    if (error) {
      console.error(`Erreur détaillée ${provider}:`, error);
      toast({
        title: "Erreur de connexion",
        description: `Une erreur est survenue lors de la connexion avec ${provider}. Veuillez réessayer.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleGoogleSignup = async () => {
    try {
      console.log("Démarrage de l'authentification Google...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectURL,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });

      if (handleAuthResponse(error, 'Google')) {
        console.log("Redirection Google réussie:", data);
        navigate('/onboarding');
      }
    } catch (error) {
      console.error("Erreur inattendue Google:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleFacebookSignup = async () => {
    try {
      console.log("Démarrage de l'authentification Facebook...");
      console.log("URL de redirection Facebook:", redirectURL);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectURL,
          queryParams: {
            display: 'popup',
            auth_type: 'rerequest',
            scope: 'email,public_profile',
            response_type: 'code'
          }
        }
      });

      if (handleAuthResponse(error, 'Facebook')) {
        console.log("Redirection Facebook réussie:", data);
        navigate('/onboarding');
      }
    } catch (error) {
      console.error("Erreur inattendue Facebook:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleAppleSignup = async () => {
    toast({
      title: "Configuration requise",
      description: "La connexion avec Apple n'est pas encore configurée. Veuillez utiliser une autre méthode pour le moment.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full justify-center gap-2 bg-black text-white hover:bg-gray-800"
        onClick={handleAppleSignup}
      >
        <Apple className="h-5 w-5" />
        Continuer avec Apple
      </Button>

      <Button 
        variant="outline" 
        className="w-full justify-center gap-2"
        onClick={handleGoogleSignup}
      >
        <FcGoogle className="h-5 w-5" />
        Continuer avec Google
      </Button>

      <Button 
        variant="outline" 
        className="w-full justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
        onClick={handleFacebookSignup}
      >
        <Facebook className="h-5 w-5" />
        Continuer avec Facebook
      </Button>
    </div>
  );
};