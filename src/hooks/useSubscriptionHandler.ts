import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const useSubscriptionHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'interac' = 'card',
    couponCode?: string,
    billingPeriod: 'monthly' | 'annual' = 'monthly'
  ) => {
    try {
      console.log('Redirecting to AI store creation for plan:', planType);
      
      // Store plan choice and redirect to AI store creation
      sessionStorage.setItem('selectedPlan', JSON.stringify({ planType, couponCode, billingPeriod }));
      navigate('/creer-boutique-ia');
      
    } catch (error: any) {
      console.error('Subscription redirect error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return { handleSubscribe };
};
