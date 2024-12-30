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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur de session:", sessionError);
          throw sessionError;
        }

        if (!session) {
          toast({
            title: "Accès refusé",
            description: "Veuillez vous connecter pour accéder à cette page",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Vérifier l'abonnement
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

        if (!hasActiveSubscription) {
          // Vérifier si l'utilisateur est en période d'essai
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('trial_ends_at')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Erreur de profil:", profileError);
            throw profileError;
          }

          if (!profile?.trial_ends_at || new Date(profile.trial_ends_at) < new Date()) {
            toast({
              title: "Abonnement requis",
              description: "Veuillez souscrire à un abonnement pour accéder à cette fonctionnalité",
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
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        navigate("/");
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