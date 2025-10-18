import { Button } from "@/components/ui/button";
import { Apple, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { isPreviewEnv } from "@/utils/env";

export const SocialAuthButtons = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  console.log("Initialisation des boutons d'authentification sociale");
  
  const handleAuthResponse = async (error: any, provider: string) => {
    if (error) {
      console.error(`Erreur d'authentification ${provider}:`, error);
      toast({
        title: "Erreur de connexion",
        description: `Une erreur est survenue lors de la connexion avec ${provider}. Veuillez réessayer.`,
        variant: "destructive",
      });
      return false;
    }
    
    // Vérifier la session après l'authentification
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("Erreur lors de la vérification de la session:", sessionError);
      return false;
    }
    
    console.log(`Authentification ${provider} réussie, ID utilisateur:`, session.user.id);
    return true;
  };

  const handleGoogleSignup = async () => {
    try {
      console.log("Démarrage de l'authentification Google...");
      
      // In preview environment, open in new tab to avoid iframe restrictions
      const inPreview = isPreviewEnv();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/connexion`,
          skipBrowserRedirect: inPreview,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        },
      });

      // If in preview, manually open the auth URL in a new tab
      if (inPreview && data?.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
        toast({
          title: "Authentification en cours",
          description: "Une nouvelle fenêtre s'est ouverte pour l'authentification Google.",
        });
      }

      if (error) {
        console.error('Erreur d\'authentification Google:', error);
        toast({
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la connexion avec Google. Veuillez réessayer.",
          variant: "destructive",
        });
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
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/connexion`,
          queryParams: {
            display: 'popup',
            auth_type: 'rerequest',
            scope: 'email,public_profile'
          }
        }
      });

      if (await handleAuthResponse(error, 'Facebook')) {
        console.log("Redirection Facebook réussie:", data);
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