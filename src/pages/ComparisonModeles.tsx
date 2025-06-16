
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Bot, User, Zap, Clock, DollarSign, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function ComparisonModeles() {
  const features = [
    {
      feature: "Temps de création",
      aiStore: "5-10 minutes",
      manual: "Plusieurs heures/jours",
      aiIcon: <Zap className="h-4 w-4 text-green-500" />,
      manualIcon: <Clock className="h-4 w-4 text-yellow-500" />
    },
    {
      feature: "Effort requis",
      aiStore: "Minimal (choix de niche)",
      manual: "Important (design, contenu, SEO)",
      aiIcon: <Check className="h-4 w-4 text-green-500" />,
      manualIcon: <X className="h-4 w-4 text-red-500" />
    },
    {
      feature: "Personnalisation",
      aiStore: "Limitée aux templates IA",
      manual: "Totale liberté créative",
      aiIcon: <X className="h-4 w-4 text-red-500" />,
      manualIcon: <Check className="h-4 w-4 text-green-500" />
    },
    {
      feature: "Produits inclus",
      aiStore: "30 ou 100+ produits optimisés",
      manual: "Vous ajoutez vos produits",
      aiIcon: <Check className="h-4 w-4 text-green-500" />,
      manualIcon: <User className="h-4 w-4 text-blue-500" />
    },
    {
      feature: "SEO optimisé",
      aiStore: "Automatique par IA",
      manual: "Vous configurez",
      aiIcon: <Check className="h-4 w-4 text-green-500" />,
      manualIcon: <User className="h-4 w-4 text-blue-500" />
    },
    {
      feature: "Coût initial",
      aiStore: "$20-80 (une fois)",
      manual: "Gratuit",
      aiIcon: <DollarSign className="h-4 w-4 text-yellow-500" />,
      manualIcon: <Check className="h-4 w-4 text-green-500" />
    },
    {
      feature: "Coût mensuel",
      aiStore: "Plan Sokoby requis",
      manual: "Plan Sokoby requis",
      aiIcon: <DollarSign className="h-4 w-4 text-blue-500" />,
      manualIcon: <DollarSign className="h-4 w-4 text-blue-500" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Boutique IA vs Création Manuelle
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Deux approches différentes pour créer votre boutique en ligne. 
            Choisissez selon vos besoins, votre budget et le temps disponible.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* AI Store Card */}
          <Card className="border-2 border-primary relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary">
                <Bot className="h-4 w-4 mr-1" />
                Service Premium
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Boutique IA</CardTitle>
              <CardDescription>
                Service "clé en main" - Nous créons votre boutique automatiquement
              </CardDescription>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">$20-80</div>
                <div className="text-sm text-gray-600">Frais unique de génération</div>
                <div className="text-sm text-gray-500">+ Abonnement Sokoby mensuel</div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Boutique créée en 5-10 minutes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">30-100+ produits inclus et optimisés</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">SEO automatiquement configuré</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Design professionnel généré</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Fournisseurs intégrés automatiquement</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/creer-boutique-ia">
                  Créer ma Boutique IA
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Manual Creation Card */}
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Création Manuelle</CardTitle>
              <CardDescription>
                Créez vous-même votre boutique avec nos outils
              </CardDescription>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">Gratuit</div>
                <div className="text-sm text-gray-600">Aucun frais de création</div>
                <div className="text-sm text-gray-500">Seulement l'abonnement Sokoby mensuel</div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Contrôle total du design</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Personnalisation illimitée</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Ajoutez vos propres produits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Évolutif selon vos besoins</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Temps de création plus long</span>
                </li>
              </ul>
              <Button variant="outline" asChild className="w-full">
                <Link to="/register">
                  Commencer gratuitement
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Comparison Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Comparaison détaillée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-2">Critère</th>
                    <th className="text-center py-4 px-2">
                      <Bot className="h-5 w-5 mx-auto mb-1" />
                      Boutique IA
                    </th>
                    <th className="text-center py-4 px-2">
                      <User className="h-5 w-5 mx-auto mb-1" />
                      Création Manuelle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-2 font-medium">{item.feature}</td>
                      <td className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {item.aiIcon}
                          <span className="text-sm">{item.aiStore}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {item.manualIcon}
                          <span className="text-sm">{item.manual}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Choisissez la Boutique IA si :
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Vous voulez une boutique rapidement opérationnelle</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Vous préférez un service "clé en main"</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Vous débutez dans l'e-commerce</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Vous voulez des produits pré-sélectionnés</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Choisissez la Création Manuelle si :
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Vous avez une vision précise de votre boutique</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Vous voulez un contrôle total du design</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Vous avez vos propres produits à vendre</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Vous voulez économiser sur les frais initiaux</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
