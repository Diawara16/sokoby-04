import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
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
        .eq('status', 'active');

      console.log('Subscriptions:', subscriptions);

      if (subError) {
        console.error('Erreur lors de la vérification de l\'abonnement:', subError);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier votre abonnement",
          variant: "destructive",
        });
        return;
      }

      const hasActiveSubscription = subscriptions && subscriptions.length > 0;

      if (!hasActiveSubscription) {
        // Vérifier si l'utilisateur est en période d'essai
        const { data: profile } = await supabase
          .from('profiles')
          .select('trial_ends_at')
          .eq('id', session.user.id)
          .single();

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
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return <>{children}</>;
};