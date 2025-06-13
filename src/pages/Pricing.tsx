
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { useSubscriptionHandler } from "@/hooks/useSubscriptionHandler";

const Pricing = () => {
  const { handleSubscribe } = useSubscriptionHandler();

  return (
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
  );
};

export default Pricing;
