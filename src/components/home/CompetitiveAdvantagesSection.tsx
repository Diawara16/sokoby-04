
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, DollarSign, Bot, Globe, Shield, TrendingUp, Users, Smartphone } from "lucide-react";

export function CompetitiveAdvantagesSection() {
  const advantages = [
    {
      icon: Bot,
      title: "IA Intégrée",
      description: "Assistant IA qui gère automatiquement votre boutique, optimise les prix et génère du contenu",
      comparison: "Shopify : Extensions payantes requises",
      savings: "Économie : 200€/mois"
    },
    {
      icon: DollarSign,
      title: "Tarifs Transparents",
      description: "Pas de frais cachés, pas de commissions sur les ventes, tout inclus dès 29€/mois",
      comparison: "Shopify : 2,9% + frais par transaction",
      savings: "Économie : 300€/mois sur 10k€ de CA"
    },
    {
      icon: Zap,
      title: "Création Instantanée",
      description: "Boutique complète créée en 10 minutes avec IA vs 2-3 jours manuellement",
      comparison: "Shopify : Configuration manuelle complexe",
      savings: "Gain : 20h de développement"
    },
    {
      icon: Globe,
      title: "Multi-canal Natif",
      description: "Vente sur Facebook, Instagram, TikTok, Amazon intégrée nativement",
      comparison: "Shopify : Apps tierces payantes",
      savings: "Économie : 150€/mois"
    },
    {
      icon: Shield,
      title: "Sécurité Bancaire",
      description: "Hébergement sécurisé, SSL inclus, conformité RGPD automatique",
      comparison: "Shopify : Options de sécurité avancées payantes",
      savings: "Économie : 100€/mois"
    },
    {
      icon: TrendingUp,
      title: "Analytics Avancées",
      description: "Tableaux de bord intelligents avec prédictions IA incluses",
      comparison: "Shopify : Shopify Plus requis (2000€/mois)",
      savings: "Économie : 1800€/mois"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-red-100 text-red-800 hover:bg-red-100">
            Pourquoi choisir Sokoby plutôt que Shopify ?
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Notre avantage concurrentiel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez pourquoi plus de 25 000 entrepreneurs ont choisi Sokoby 
            plutôt que les solutions traditionnelles comme Shopify
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <IconComponent className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl">{advantage.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{advantage.description}</p>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500 italic">
                      {advantage.comparison}
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {advantage.savings}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Total Savings Calculation */}
        <div className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-12 shadow-xl">
          <h3 className="text-3xl font-bold mb-4">Économies totales vs Shopify</h3>
          <div className="text-6xl font-bold mb-2">2 650€</div>
          <p className="text-xl opacity-90 mb-6">par mois pour une boutique générant 10k€ de CA</p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold">31 800€</div>
              <div className="opacity-80">économisés par an</div>
            </div>
            <div>
              <div className="text-2xl font-bold">10x</div>
              <div className="opacity-80">moins cher</div>
            </div>
            <div>
              <div className="text-2xl font-bold">20h</div>
              <div className="opacity-80">gagnées par mois</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
