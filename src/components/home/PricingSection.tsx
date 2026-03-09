import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Tarification transparente
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Choisissez le plan qui vous convient
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Créez votre boutique IA et choisissez un plan adapté à vos besoins.
          </p>
        </div>

        <div className="text-center">
          <Link to="/creer-boutique-ia">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              Créer ma boutique IA
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Choisissez votre plan pendant la création de votre boutique
          </p>
        </div>
      </div>
    </section>
  );
}
