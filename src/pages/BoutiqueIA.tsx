
import { VendorAssistant } from "@/components/ai/VendorAssistant";
import { PriceOptimizer } from "@/components/ai/PriceOptimizer";
import { ProductImageGenerator } from "@/components/ai/ProductImageGenerator";
import { MarketingTools } from "@/components/ai/MarketingTools";
import { StoreGallery } from "@/components/store-creator/StoreGallery";
import { AIPricing } from "@/components/store-creator/AIPricing";
import { VideoExplainer } from "@/components/store-creator/VideoExplainer";
import { TestimonialsSection } from "@/components/store-creator/TestimonialsSection";
import { Bot, Sparkles, ShoppingBag, Wand2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BoutiqueIA() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        {/* Hero Section with Clarification */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 px-6 py-3 text-lg">
              <Bot className="h-6 w-6 mr-2" />
              Service Premium "Clé en Main"
              <Sparkles className="h-5 w-5 ml-2" />
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 font-heading">
            Boutique créée automatiquement par IA
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <strong>Nous créons votre boutique pour vous</strong> : notre IA génère une boutique complète 
            avec produits, SEO optimisé et fournisseurs intégrés en quelques minutes.
          </p>
          
          {/* Value Proposition Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto my-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Service Automatisé</h3>
                <p className="text-sm text-gray-600">Nos développeurs + IA créent votre boutique</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Produits Inclus</h3>
                <p className="text-sm text-gray-600">30-100+ produits sélectionnés et optimisés</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Prêt à Vendre</h3>
                <p className="text-sm text-gray-600">Boutique opérationnelle immédiatement</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/creer-boutique-ia">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold">
                <Wand2 className="h-5 w-5 mr-2" />
                Créer ma boutique IA ($20-80)
              </Button>
            </Link>
            <Link to="/comparaison-modeles">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-primary text-primary hover:bg-primary/5">
                Comparer les options
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Important :</strong> La Boutique IA est un service premium unique ($20-80) 
              + votre abonnement Sokoby mensuel habituel pour l'hébergement et les fonctionnalités.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Main Content Tabs */}
        <Tabs defaultValue="pricing" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="pricing">Tarifs</TabsTrigger>
            <TabsTrigger value="examples">Exemples</TabsTrigger>
            <TabsTrigger value="video">Vidéo</TabsTrigger>
            <TabsTrigger value="tools">Outils IA</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="mt-8">
            <AIPricing />
          </TabsContent>

          <TabsContent value="examples" className="mt-8">
            <StoreGallery />
          </TabsContent>

          <TabsContent value="video" className="mt-8">
            <VideoExplainer />
          </TabsContent>

          <TabsContent value="tools" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
              <VendorAssistant />
              <PriceOptimizer />
              <ProductImageGenerator />
              <MarketingTools />
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Quelle est la différence avec la création manuelle ?</h3>
              <p className="text-sm text-gray-600">
                La Boutique IA est un service premium où nous créons tout pour vous automatiquement. 
                La création manuelle est gratuite mais vous devez tout faire vous-même.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Les $20-80 sont-ils en plus de l'abonnement ?</h3>
              <p className="text-sm text-gray-600">
                Oui, c'est un frais unique pour la génération automatique. Vous avez ensuite besoin 
                d'un abonnement Sokoby pour héberger et gérer votre boutique.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Puis-je modifier ma boutique après génération ?</h3>
              <p className="text-sm text-gray-600">
                Absolument ! Une fois générée, vous avez accès à tous les outils Sokoby pour 
                personnaliser, ajouter des produits et faire évoluer votre boutique.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Combien de temps pour avoir ma boutique ?</h3>
              <p className="text-sm text-gray-600">
                Entre 5 et 10 minutes en moyenne. Notre IA génère tout automatiquement : 
                produits, design, SEO et intégrations fournisseurs.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Prêt à lancer votre business automatiquement ?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Rejoignez des centaines d'entrepreneurs qui ont choisi notre service premium 
            pour créer leur boutique en quelques minutes au lieu de plusieurs semaines.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/creer-boutique-ia">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Créer ma Boutique IA maintenant
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Parler à un expert
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
