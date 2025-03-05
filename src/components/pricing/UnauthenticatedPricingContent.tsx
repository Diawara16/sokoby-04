
import { PlanComparison } from "@/components/pricing/PlanComparison";
import { PricingPlans } from "@/components/pricing/PricingPlans";

interface UnauthenticatedPricingContentProps {
  onSubscribe: (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay',
    couponCode?: string
  ) => void;
  currencySymbol?: string;
}

const UnauthenticatedPricingContent = ({
  onSubscribe,
  currencySymbol = "$"
}: UnauthenticatedPricingContentProps) => {
  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-12">Nos Plans Tarifaires</h1>
      <PricingPlans currentLanguage="fr" onSubscribe={onSubscribe} />
      <PlanComparison currentLanguage="fr" />
    </>
  );
};

export default UnauthenticatedPricingContent;
