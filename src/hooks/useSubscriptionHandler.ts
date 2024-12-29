import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const useSubscriptionHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay',
    couponCode?: string
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour souscrire à un abonnement",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      console.log("Creating checkout session for plan:", planType);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { planType, paymentMethod, couponCode }
      });

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la session de paiement",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la session de paiement",
        variant: "destructive",
      });
    }
  };

  return { handleSubscribe };
};