import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkUserAccess } from "@/hooks/useAccessControl";

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
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!session) {
          toast({
            title: "Accès refusé",
            description: "Veuillez vous connecter pour accéder à cette page",
            variant: "destructive",
          });
          navigate("/connexion");
          return;
        }

        const access = await checkUserAccess(session.user.id);

        if (access.level === "paid") {
          // Paid user — full access, no trial warning
        } else if (access.level === "trial") {
          toast({
            title: "Période d'essai active",
            description: `Il vous reste ${access.daysLeft} jour(s) d'essai gratuit.`,
          });
        } else {
          // Blocked — trial expired, no payment
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
                    const { data, error } = await supabase.functions.invoke("create-billing-portal-session");
                    if (error) throw error;
                    if (data?.url) window.open(data.url, "_blank");
                  } catch {
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
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth error:", error);
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
  }, [navigate, toast, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
