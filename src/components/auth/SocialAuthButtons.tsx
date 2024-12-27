import { Button } from "@/components/ui/button";
import { Apple, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const SocialAuthButtons = () => {
  const { toast } = useToast();

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      });

      if (error) {
        console.error("Erreur Google Auth:", error);
        toast({
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la connexion avec Google. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleAppleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      });

      if (error) {
        console.error("Erreur Apple Auth:", error);
        toast({
          title: "Configuration requise",
          description: "La connexion avec Apple n'est pas encore configurée. Veuillez utiliser une autre méthode pour le moment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion avec Apple",
        variant: "destructive",
      });
    }
  };

  const handleFacebookSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    });

    if (error) {
      console.error("Erreur Facebook Auth:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion avec Facebook",
        variant: "destructive",
      });
    }
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
        S'inscrire avec Google
      </Button>

      <Button 
        variant="outline" 
        className="w-full justify-center gap-2"
        onClick={handleFacebookSignup}
      >
        <Facebook className="h-5 w-5 text-blue-600" />
        S'inscrire avec Facebook
      </Button>
    </div>
  );
};