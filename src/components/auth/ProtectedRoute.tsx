
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
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

        // Check if user has PAID status (one-time payment or subscription)
        let hasPaidAccess = false;

        // 1. Check subscriptions table (for subscription-based plans)
        try {
          const { data: subscriptions } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .maybeSingle();
          if (subscriptions) hasPaidAccess = true;
        } catch (error) {
          console.warn('Subscription check error (non-critical):', error);
        }

        // 2. Check store_settings for completed payment (one-time AI store payment)
        if (!hasPaidAccess) {
          try {
            const { data: store } = await supabase
              .from('store_settings')
              .select('payment_status')
              .eq('user_id', session.user.id)
              .eq('payment_status', 'completed')
              .maybeSingle();
            if (store) {
              hasPaidAccess = true;
              console.log("Paid store found - payment_status: completed");
            }
          } catch (error) {
            console.warn('Store payment check error (non-critical):', error);
          }
        }

        // 3. Check Stripe table for paid plan
        if (!hasPaidAccess) {
          try {
            const { data: stripeRecord } = await supabase
              .from('Stripe')
              .select('plan, trial_expired')
              .eq('id', session.user.id)
              .maybeSingle();
            if (stripeRecord && stripeRecord.plan !== 'free') {
              hasPaidAccess = true;
              console.log("Paid plan found in Stripe table:", stripeRecord.plan);
            }
          } catch (error) {
            console.warn('Stripe table check error (non-critical):', error);
          }
        }

        console.log("Paid access:", hasPaidAccess);

        // If user has paid, skip trial check entirely
        if (!hasPaidAccess) {
          const trialEndsAt = profile?.trial_ends_at;
          const isTrialActive = trialEndsAt && new Date(trialEndsAt) > new Date();
          
          console.log("Période d'essai active:", isTrialActive);
          console.log("Date fin d'essai:", trialEndsAt);

          if (!isTrialActive) {
            console.log("Période d'essai expirée et aucun paiement détecté");
            toast({
              title: "Abonnement requis",
              description: "Votre période d'essai gratuit est terminée. Veuillez souscrire à un abonnement pour continuer.",
              variant: "destructive",
              action: (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      const { data, error } = await supabase.functions.invoke('create-billing-portal-session');
                      
                      if (error) throw error;
                      
                      if (data?.url) {
                        window.open(data.url, '_blank');
                        toast({
                          title: "Portail de facturation ouvert",
                          description: "Vous pouvez maintenant gérer votre abonnement dans l'onglet ouvert.",
                        });
                      }
                    } catch (error: any) {
                      console.error("Erreur ouverture portail:", error);
                      toast({
                        title: "Erreur",
                        description: "Impossible d'accéder au portail de facturation. Redirection vers les plans.",
                        variant: "destructive",
                      });
                      navigate("/plan-tarifaire");
                    }
                  }}
                  className="ml-2"
                >
                  Gérer l'abonnement
                </Button>
              ),
            });
            if (location.pathname !== "/gestion-compte") {
              navigate("/gestion-compte", { replace: true });
              return;
            }
          } else {
            const daysLeft = Math.ceil((new Date(trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            toast({
              title: "Période d'essai active",
              description: `Il vous reste ${daysLeft} jour(s) d'essai gratuit.`,
            });
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
