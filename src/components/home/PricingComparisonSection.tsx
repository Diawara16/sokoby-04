
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";

export function PricingComparisonSection() {
  const comparison = [
    {
      feature: "Prix de base",
      sokoby: "29€/mois",
      shopify: "29€/mois",
      sokobyBetter: false
    },
    {
      feature: "Frais de transaction",
      sokoby: "0%",
      shopify: "2,9% + 0,30€",
      sokobyBetter: true
    },
    {
      feature: "IA intégrée",
      sokoby: "Incluse",
      shopify: "200€/mois en apps",
      sokobyBetter: true
    },
    {
      feature: "Multi-canal",
      sokoby: "Inclus",
      shopify: "150€/mois en apps",
      sokobyBetter: true
    },
    {
      feature: "Analytics avancées",
      sokoby: "Incluses",
      shopify: "Shopify Plus (2000€/mois)",
      sokobyBetter: true
    },
    {
      feature: "Support 24/7",
      sokoby: "Inclus",
      shopify: "Email uniquement",
      sokobyBetter: true
    },
    {
      feature: "Domaine personnalisé",
      sokoby: "Inclus",
      shopify: "14€/an",
      sokobyBetter: true
    },
    {
      feature: "Certificat SSL",
      sokoby: "Inclus",
      shopify: "10€/mois",
      sokobyBetter: true
    }
  ];

  const monthlyTotal = {
    sokoby: 29,
    shopify: 29 + 200 + 150 + 10 + 1.17 // base + IA + multi-canal + SSL + domaine
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">
            Comparaison détaillée
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Sokoby vs Shopify : Le vrai coût
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comparaison transparente des coûts et fonctionnalités pour une boutique génénérant 10 000€/mois
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Headers */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fonctionnalité</h3>
            </div>
            <div className="text-center">
              <div className="bg-red-600 text-white p-4 rounded-t-lg">
                <h3 className="text-2xl font-bold mb-2">Sokoby</h3>
                <Badge className="bg-red-700 text-white">Recommandé</Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-600 text-white p-4 rounded-t-lg">
                <h3 className="text-2xl font-bold">Shopify</h3>
              </div>
            </div>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-0">
              {comparison.map((item, index) => (
                <div key={index} className={`grid grid-cols-1 md:grid-cols-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="p-4 font-medium text-gray-900 border-b md:border-b-0 md:border-r">
                    {item.feature}
                  </div>
                  <div className={`p-4 text-center border-b md:border-b-0 md:border-r ${item.sokobyBetter ? 'bg-green-50' : ''}`}>
                    <span className={`font-semibold ${item.sokobyBetter ? 'text-green-700' : 'text-gray-700'}`}>
                      {item.sokoby}
                    </span>
                    {item.sokobyBetter && <Check className="inline h-4 w-4 text-green-600 ml-2" />}
                  </div>
                  <div className="p-4 text-center border-b md:border-b-0">
                    <span className="font-semibold text-gray-700">{item.shopify}</span>
                    {item.sokobyBetter && <X className="inline h-4 w-4 text-red-600 ml-2" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Total Cost Comparison */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2 border-red-200 shadow-xl">
            <CardHeader className="bg-red-600 text-white">
              <CardTitle className="text-2xl text-center">Sokoby - Total</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="text-5xl font-bold text-red-600 mb-4">29€</div>
              <div className="text-gray-600 mb-6">par mois, tout inclus</div>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" /> Toutes fonctionnalités incluses</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" /> 0% de commission</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" /> IA + Multi-canal + Analytics</li>
              </ul>
              <Badge className="bg-green-100 text-green-800 text-lg py-2 px-4">
                Économie : 361€/mois
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader className="bg-gray-600 text-white">
              <CardTitle className="text-2xl text-center">Shopify - Total</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="text-5xl font-bold text-gray-600 mb-4">390€</div>
              <div className="text-gray-600 mb-6">par mois avec extensions</div>
              <ul className="text-left space-y-2 mb-6 text-sm">
                <li>• Base: 29€ + IA: 200€ + Multi-canal: 150€</li>
                <li>• SSL: 10€ + Domaine: 1€</li>
                <li>• + 2,9% sur 10k€ = 290€ de commissions</li>
              </ul>
              <Badge className="bg-red-100 text-red-800 text-lg py-2 px-4">
                Coût réel avec commissions
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à économiser 4 320€ par an ?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez les milliers d'entrepreneurs qui ont fait le bon choix
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/essai-gratuit">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Essai Gratuit 14 jours
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Migration gratuite depuis Shopify
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
