
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { PlanComparison } from "@/components/pricing/PlanComparison";
import { useSubscriptionHandler } from "@/hooks/useSubscriptionHandler";
import { CompetitiveAdvantagesSection } from "@/components/home/CompetitiveAdvantagesSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { PricingComparisonSection } from "@/components/home/PricingComparisonSection";
import { CTASection } from "@/components/home/CTASection";

const Pricing = () => {
  const { handleSubscribe } = useSubscriptionHandler();

  const handleCreateStore = () => {
    // Redirect to store creation
    window.location.href = '/creer-boutique-ia';
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos tarifs</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choisissez le plan qui correspond le mieux à vos besoins. Tous nos plans incluent une période d'essai gratuite de 14 jours.
          </p>
        </div>

        <PricingPlans 
          currentLanguage="fr"
          onSubscribe={handleSubscribe}
        />
      </div>

      {/* Plan Comparison */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <PlanComparison currentLanguage="fr" />
        </div>
      </div>

      {/* Competitive Advantages */}
      <CompetitiveAdvantagesSection />

      {/* Pricing Comparison with Shopify */}
      <PricingComparisonSection />

      {/* Social Proof */}
      <SocialProofSection />

      {/* Final CTA */}
      <CTASection 
        currentLanguage="fr" 
        onCreateStore={handleCreateStore}
      />
    </div>
  );
};

export default Pricing;
