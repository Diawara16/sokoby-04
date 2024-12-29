import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { ReferralCard } from "@/components/referral/ReferralCard";
import { PlanComparison } from "@/components/pricing/PlanComparison";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { StoreSettings } from "@/components/store/StoreSettings";
import { UserPermissions } from "@/components/store/UserPermissions";
import { useProfileCreation } from "@/hooks/useProfileCreation";
import { LoadingSpinner } from "./LoadingSpinner";

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
  const { isCreatingProfile } = useProfileCreation(hasProfile);

  if (isCreatingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner message="Création de votre profil en cours..." />
      </div>
    );
  }

  return (
    <>
      <UserDashboard />
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Configuration de la boutique
        </h2>
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