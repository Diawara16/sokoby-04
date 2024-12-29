import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { ReferralCard } from "@/components/referral/ReferralCard";
import { PlanComparison } from "@/components/pricing/PlanComparison";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { StoreSettings } from "@/components/store/StoreSettings";
import { UserPermissions } from "@/components/store/UserPermissions";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AuthenticatedPricingContentProps {
  hasProfile: boolean;
  onSubscribe: (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay',
    couponCode?: string
  ) => void;
}

export const AuthenticatedPricingContent = ({
  hasProfile,
  onSubscribe,
}: AuthenticatedPricingContentProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const createProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: existingProfile } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single();

        if (!existingProfile) {
          const { error } = await supabase
            .from('profiles')
            .insert([{ id: user.id, email: user.email }]);

          if (error) throw error;

          toast({
            title: "Profil créé",
            description: "Votre profil a été créé avec succès",
          });
        }
      } catch (error: any) {
        console.error("Erreur lors de la création du profil:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de votre profil",
          variant: "destructive",
        });
      }
    };

    if (!hasProfile) {
      createProfile();
    }
  }, [hasProfile, toast]);

  if (!hasProfile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Création de votre profil en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserDashboard />
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Configuration de la boutique</h2>
        <div className="space-y-8">
          <StoreSettings />
          <UserPermissions />
          <PricingPlans currentLanguage="fr" onSubscribe={onSubscribe} />
          <PlanComparison currentLanguage="fr" />
          <ReferralCard />
          <PaymentHistory />
        </div>
      </div>
    </>
  );
};