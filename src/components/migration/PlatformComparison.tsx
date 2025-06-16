
import { CheckCircle, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ComparisonData {
  feature: string;
  sokoby: string;
  competitor: string;
  competitorName: string;
}

const platformComparisons: { [key: string]: ComparisonData[] } = {
  woocommerce: [
    { feature: "Hébergement", sokoby: "Inclus", competitor: "À votre charge", competitorName: "WooCommerce" },
    { feature: "Maintenance", sokoby: "Automatique", competitor: "Manuelle", competitorName: "WooCommerce" },
    { feature: "Sécurité", sokoby: "Intégrée", competitor: "Plugins payants", competitorName: "WooCommerce" },
    { feature: "Performance", sokoby: "Optimisée", competitor: "Dépend hosting", competitorName: "WooCommerce" },
    { feature: "Support", sokoby: "Dédié 24/7", competitor: "Communauté", competitorName: "WooCommerce" },
    { feature: "Frais mensuels", sokoby: "€29/mois", competitor: "€15-200/mois", competitorName: "WooCommerce" }
  ],
  bigcommerce: [
    { feature: "Frais mensuels", sokoby: "€29/mois", competitor: "€29-400/mois", competitorName: "BigCommerce" },
    { feature: "Frais transaction", sokoby: "0%", competitor: "0-1.5%", competitorName: "BigCommerce" },
    { feature: "API calls/h", sokoby: "Illimitées", competitor: "20,000-400,000", competitorName: "BigCommerce" },
    { feature: "Bande passante", sokoby: "Illimitée", competitor: "Limitée", competitorName: "BigCommerce" },
    { feature: "Support français", sokoby: "Natif", competitor: "Limité", competitorName: "BigCommerce" },
    { feature: "Complexité", sokoby: "Simple", competitor: "Complexe", competitorName: "BigCommerce" }
  ],
  squarespace: [
    { feature: "E-commerce plan", sokoby: "€29/mois", competitor: "€27/mois", competitorName: "Squarespace" },
    { feature: "Frais transaction", sokoby: "0%", competitor: "3%", competitorName: "Squarespace" },
    { feature: "Produits", sokoby: "Illimités", competitor: "Illimités", competitorName: "Squarespace" },
    { feature: "Personnalisation", sokoby: "Avancée", competitor: "Limitée", competitorName: "Squarespace" },
    { feature: "SEO", sokoby: "Optimisé", competitor: "Basique", competitorName: "Squarespace" },
    { feature: "Analytics", sokoby: "Avancées", competitor: "Basiques", competitorName: "Squarespace" }
  ],
  magento: [
    { feature: "Complexité", sokoby: "Simple", competitor: "Très complexe", competitorName: "Magento" },
    { feature: "Hébergement", sokoby: "Inclus", competitor: "À votre charge", competitorName: "Magento" },
    { feature: "Développement", sokoby: "Non requis", competitor: "Obligatoire", competitorName: "Magento" },
    { feature: "Maintenance", sokoby: "Automatique", competitor: "Technique", competitorName: "Magento" },
    { feature: "Coût total", sokoby: "€29/mois", competitor: "€500-5000/mois", competitorName: "Magento" },
    { feature: "Temps setup", sokoby: "Immédiat", competitor: "3-6 mois", competitorName: "Magento" }
  ],
  volusion: [
    { feature: "Frais mensuels", sokoby: "€29/mois", competitor: "€29-79/mois", competitorName: "Volusion" },
    { feature: "Bande passante", sokoby: "Illimitée", competitor: "1-35GB", competitorName: "Volusion" },
    { feature: "Produits", sokoby: "Illimités", competitor: "100-10,000", competitorName: "Volusion" },
    { feature: "Modernité", sokoby: "Récente", competitor: "Ancienne (1999)", competitorName: "Volusion" },
    { feature: "Interface", sokoby: "Moderne", competitor: "Datée", competitorName: "Volusion" },
    { feature: "Évolutivité", sokoby: "Haute", competitor: "Limitée", competitorName: "Volusion" }
  ]
};

interface PlatformComparisonProps {
  platform: string;
}

export const PlatformComparison = ({ platform }: PlatformComparisonProps) => {
  const navigate = useNavigate();
  const comparison = platformComparisons[platform];
  
  if (!comparison) return null;

  const handleMigrationClick = () => {
    navigate(`/migration-${platform}`);
  };

  const competitorName = comparison[0]?.competitorName || platform;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Sokoby vs {competitorName}: La vraie comparaison
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez pourquoi migrer de {competitorName} vers Sokoby
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
                <CardDescription>Solution complète et moderne</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {comparison.map((item, index) => (
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

            {/* Competitor Column */}
            <Card>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{competitorName}</CardTitle>
                <div className="text-4xl font-bold text-red-600">Variable</div>
                <CardDescription>Coûts et complexité cachés</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {comparison.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.feature}</span>
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-red-600">{item.competitor}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Migration CTA */}
          <div className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-2xl mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-8 w-8" />
              <h3 className="text-3xl font-bold">Libérez-vous de {competitorName}</h3>
            </div>
            <p className="text-xl mb-6">
              Migration 100% gratuite et accompagnée par nos experts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleMigrationClick}
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
              >
                Migration gratuite depuis {competitorName}
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
            <h4 className="text-xl font-bold mb-4 text-center">Migration expertise {competitorName}</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h5 className="font-semibold mb-2">Expertise spécialisée</h5>
                <p className="text-sm text-gray-600">Notre équipe maîtrise parfaitement {competitorName}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h5 className="font-semibold mb-2">Migration complète</h5>
                <p className="text-sm text-gray-600">Produits, clients, commandes - tout est transféré</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h5 className="font-semibold mb-2">Support dédié</h5>
                <p className="text-sm text-gray-600">Accompagnement personnalisé tout au long du processus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
