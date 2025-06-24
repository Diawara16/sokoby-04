
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Zap, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ModelComparisonSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Deux façons de créer votre boutique
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez l'approche qui convient le mieux à vos besoins et à votre style
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* AI Store */}
          <Card className="border-2 border-primary shadow-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary px-4 py-1">
                <Zap className="h-4 w-4 mr-1" />
                Service Premium
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">Boutique IA</CardTitle>
              <CardDescription className="text-base">
                Notre IA crée votre boutique complète automatiquement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">$20 - $80</div>
                <div className="text-sm text-gray-600">Frais unique de génération</div>
                <div className="text-xs text-gray-500">+ Abonnement mensuel Sokoby</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Boutique créée en 5-10 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">30-100+ produits inclus et optimisés</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">SEO et fournisseurs intégrés</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Design professionnel automatique</span>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link to="/boutique-ia">
                  Découvrir la Boutique IA
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Manual Creation */}
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl mb-2">Création Manuelle</CardTitle>
              <CardDescription className="text-base">
                Créez votre boutique vous-même avec nos outils
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">À partir de 11$</div>
                <div className="text-sm text-gray-600">Abonnement mensuel</div>
                <div className="text-xs text-gray-500">Essai gratuit de 14 jours</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Contrôle total du design</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Personnalisation illimitée</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Ajoutez vos propres produits</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Évolutif selon vos besoins</span>
                </div>
              </div>

              <Button variant="outline" asChild className="w-full">
                <Link to="/tarifs">
                  Voir les plans tarifaires
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Pas sûr de votre choix ? Comparez en détail les deux approches.
          </p>
          <Button variant="outline" asChild>
            <Link to="/comparaison-modeles">
              Voir la comparaison complète
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
