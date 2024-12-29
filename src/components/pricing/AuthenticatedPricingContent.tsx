import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { ReferralCard } from "@/components/referral/ReferralCard";
import { PlanComparison } from "@/components/pricing/PlanComparison";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { StoreSettings } from "@/components/store/StoreSettings";

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
  if (!hasProfile) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profil non trouvé</h2>
        <p className="text-gray-600 mb-8">Impossible de charger votre profil</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <>
      <UserDashboard />
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Nos Plans Tarifaires</h2>
        <PricingPlans currentLanguage="fr" onSubscribe={onSubscribe} />
        <PlanComparison currentLanguage="fr" />
        <div className="mt-16">
          <StoreSettings />
          <ReferralCard />
        </div>
        <PaymentHistory />
      </div>
    </>
  );
};