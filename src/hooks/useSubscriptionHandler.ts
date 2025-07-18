
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const useSubscriptionHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const PRICE_IDS = {
    starter: 'price_1Qe7tDI7adlqeYfaKU02O1Wj',
    pro: 'price_1Qe81sI7adlqeYfamEd7Ylpd',
    enterprise: 'price_1Qe867I7adlqeYfaJqj2sbrv'
  };

  const handleSubscribe = async (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'interac' = 'card',
    couponCode?: string
  ) => {
    try {
      console.log('Starting subscription process:', { planType, paymentMethod, couponCode });
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Erreur de session');
      }
      
      if (!session) {
        console.log('No session found, redirecting to login...');
        // Stocker le plan choisi pour après la connexion
        localStorage.setItem('pendingSubscription', JSON.stringify({ planType, paymentMethod, couponCode }));
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour continuer votre abonnement",
          variant: "destructive",
        });
        navigate('/connexion');
        return;
      }

      console.log('User session found, creating checkout session...');
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          planType,
          paymentMethod: 'card', // Forcer 'card' pour l'instant
          couponCode 
        }
      });

      if (error) {
        console.error('Error from edge function:', error);
        throw new Error(error.message || 'Erreur lors de la création de la session');
      }

      if (!data?.url) {
        throw new Error('Aucune URL de session reçue');
      }

      console.log('Checkout session created, redirecting to:', data.url);
      
      // Rediriger vers Stripe Checkout
      window.location.href = data.url;
      
    } catch (error: any) {
      console.error('Subscription error:', error);
      
      let errorMessage = 'Une erreur est survenue lors de la souscription';
      
      if (error.message?.includes('product is not active')) {
        errorMessage = 'Le produit sélectionné n\'est pas disponible actuellement.';
      } else if (error.message?.includes('payment_method')) {
        errorMessage = 'Problème avec la méthode de paiement. Veuillez réessayer.';
      } else if (error.message?.includes('price')) {
        errorMessage = 'Erreur de tarification. Veuillez contacter le support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return { handleSubscribe };
};
