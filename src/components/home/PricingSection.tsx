
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { useSubscriptionHandler } from "@/hooks/useSubscriptionHandler";
import { Link } from "react-router-dom";
import { Gift } from "lucide-react";

export function PricingSection() {
  const { handleSubscribe } = useSubscriptionHandler();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            <Gift className="h-4 w-4 mr-2" />
            Essai gratuit disponible
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Choisissez le plan qui vous convient
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Commencez avec notre essai gratuit manuel, puis choisissez un plan qui évolue avec votre entreprise.
            Tous nos plans payants incluent la création automatique de boutique par IA.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <PricingPlans 
            currentLanguage="fr" 
            onSubscribe={handleSubscribe}
          />
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Vous avez besoin de plus d'informations ou d'une solution personnalisée ?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/pricing">
              <Button variant="outline" size="lg">
                Voir tous les détails
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Contactez-nous
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
