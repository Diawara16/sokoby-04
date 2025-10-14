
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Zap, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { T } from "@/components/translation/T";
import { TFeatureList } from "@/components/translation/TFeatureList";
import { modelComparisonFeatures } from "@/data/translatable";

export function ModelComparisonSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <T>Deux façons de créer votre boutique</T>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <T>Choisissez l'approche qui convient le mieux à vos besoins et à votre style</T>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* AI Store */}
          <Card className="border-2 border-primary shadow-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary px-4 py-1">
                <Zap className="h-4 w-4 mr-1" />
                <T>Service Premium</T>
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">
                <T>Boutique IA</T>
              </CardTitle>
              <CardDescription className="text-base">
                <T>Notre IA crée votre boutique complète automatiquement</T>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">$20 - $80</div>
                <div className="text-sm text-gray-600">
                  <T>Frais unique de génération</T>
                </div>
                <div className="text-xs text-gray-500">
                  <T>+ Abonnement mensuel Sokoby</T>
                </div>
              </div>
              
              <div className="space-y-3">
                <TFeatureList 
                  features={modelComparisonFeatures.aiStore}
                  iconComponent={<Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />}
                />
              </div>

              <Button asChild className="w-full">
                <Link to="/boutique-ia">
                  <T>Découvrir la Boutique IA</T>
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
              <CardTitle className="text-2xl mb-2">
                <T>Création Manuelle</T>
              </CardTitle>
              <CardDescription className="text-base">
                <T>Créez votre boutique vous-même avec nos outils</T>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  <T>À partir de €19</T>
                </div>
                <div className="text-sm text-gray-600">
                  <T>Abonnement mensuel</T>
                </div>
                <div className="text-xs text-gray-500">
                  <T>Essai gratuit de 14 jours</T>
                </div>
              </div>
              
              <div className="space-y-3">
                <TFeatureList 
                  features={modelComparisonFeatures.manual}
                  iconComponent={<Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />}
                />
              </div>

              <Button variant="outline" asChild className="w-full">
                <Link to="/tarifs">
                  <T>Voir les plans tarifaires</T>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            <T>Pas sûr de votre choix ? Comparez en détail les deux approches.</T>
          </p>
          <Button variant="outline" asChild>
            <Link to="/comparaison-modeles">
              <T>Voir la comparaison complète</T>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
