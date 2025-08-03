
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Vérification de la session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur de session:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("Pas de session active");
          toast({
            title: "Accès refusé",
            description: "Veuillez vous connecter pour accéder à cette page",
            variant: "destructive",
          });
          navigate("/connexion");
          return;
        }

        console.log("Session trouvée:", session.user.id);

        // Vérifier le profil utilisateur et la période d'essai
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('trial_ends_at')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Erreur de profil:", profileError);
          throw profileError;
        }

        // Vérifier l'abonnement actif
        const { data: subscriptions, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (subError) {
          console.error('Erreur lors de la vérification de l\'abonnement:', subError);
          throw subError;
        }

        const hasActiveSubscription = subscriptions !== null;
        console.log("Abonnement actif:", hasActiveSubscription);

        // Si pas d'abonnement actif, vérifier la période d'essai
        if (!hasActiveSubscription) {
          const trialEndsAt = profile?.trial_ends_at;
          const isTrialActive = trialEndsAt && new Date(trialEndsAt) > new Date();
          
          console.log("Période d'essai active:", isTrialActive);
          console.log("Date fin d'essai:", trialEndsAt);

          if (!isTrialActive) {
            console.log("Période d'essai expirée ou inexistante");
            toast({
              title: "Abonnement requis",
              description: "Votre période d'essai gratuit est terminée. Veuillez souscrire à un abonnement pour continuer.",
              variant: "destructive",
            });
            navigate("/plan-tarifaire");
            return;
          }
        }

        setIsAuthenticated(true);
      } catch (error: any) {
        console.error("Erreur d'authentification:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de votre accès",
          variant: "destructive",
        });
        navigate("/connexion");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        navigate("/connexion");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
