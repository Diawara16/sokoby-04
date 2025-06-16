
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const comparisonData = [
  {
    feature: "Frais mensuels",
    sokoby: "€29/mois",
    shopifyTotal: "€79/mois"
  },
  {
    feature: "Apps essentielles",
    sokoby: "Incluses",
    shopifyTotal: "€120/mois"
  },
  {
    feature: "Frais de transaction",
    sokoby: "0%",
    shopifyTotal: "2.4% + 0.30€"
  },
  {
    feature: "Support prioritaire",
    sokoby: "Inclus",
    shopifyTotal: "€99/mois"
  },
  {
    feature: "Domaine personnalisé",
    sokoby: "Inclus",
    shopifyTotal: "€14/an"
  },
  {
    feature: "Thèmes premium",
    sokoby: "Inclus",
    shopifyTotal: "€180 one-time"
  }
];

export const PricingComparisonSection = () => {
  const navigate = useNavigate();

  const handleMigrationClick = () => {
    navigate('/migration-shopify');
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Sokoby vs Shopify: The real cost
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez combien vous pouvez économiser en passant à Sokoby
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Sokoby Column */}
            <Card className="border-2 border-red-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Recommandé
                </span>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-red-600">Sokoby</CardTitle>
                <div className="text-4xl font-bold">€29<span className="text-xl text-gray-600">/mois</span></div>
                <CardDescription>Tout inclus, transparent</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {comparisonData.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.feature}</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-green-600">{item.sokoby}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Shopify Total Column */}
            <Card>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Shopify - Total</CardTitle>
                <div className="text-4xl font-bold text-red-600">€365<span className="text-xl text-gray-600">/mois</span></div>
                <CardDescription>Avec apps et frais cachés</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {comparisonData.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.feature}</span>
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-red-600">{item.shopifyTotal}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Savings Highlight */}
          <div className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-2xl mb-8">
            <h3 className="text-3xl font-bold mb-2">Ready to save $4,380 a year?</h3>
            <p className="text-xl mb-6">
              Migrez de Shopify vers Sokoby et économisez €365/mois
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleMigrationClick}
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
              >
                Migration gratuite depuis Shopify
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-green-600"
                onClick={() => navigate('/creer-boutique-ia')}
              >
                Créer ma boutique
              </Button>
            </div>
          </div>

          {/* Migration Benefits */}
          <div className="bg-white p-6 rounded-xl border">
            <h4 className="text-xl font-bold mb-4 text-center">Migration 100% gratuite et sécurisée</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h5 className="font-semibold mb-2">Migration complète</h5>
                <p className="text-sm text-gray-600">Produits, clients, commandes - tout est transféré</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h5 className="font-semibold mb-2">Support dédié</h5>
                <p className="text-sm text-gray-600">Notre équipe vous accompagne à chaque étape</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h5 className="font-semibold mb-2">Zéro interruption</h5>
                <p className="text-sm text-gray-600">Votre boutique reste en ligne pendant la migration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
