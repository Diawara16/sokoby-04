
import { VendorAssistant } from "@/components/ai/VendorAssistant";
import { PriceOptimizer } from "@/components/ai/PriceOptimizer";
import { ProductImageGenerator } from "@/components/ai/ProductImageGenerator";
import { MarketingTools } from "@/components/ai/MarketingTools";
import { StoreGallery } from "@/components/store-creator/StoreGallery";
import { AIPricing } from "@/components/store-creator/AIPricing";
import { VideoExplainer } from "@/components/store-creator/VideoExplainer";
import { Bot, Sparkles, ShoppingBag, Wand2, Lock, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BoutiqueIA() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 px-6 py-3 text-lg">
              <Crown className="h-6 w-6 mr-2" />
              Fonctionnalité Premium
              <Sparkles className="h-5 w-5 ml-2" />
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 font-heading">
            Créez votre boutique automatisée
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fonctionnalité premium : Notre intelligence artificielle génère une boutique complète et optimisée pour votre niche, 
            avec des produits pertinents et des descriptions détaillées.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/pricing">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold">
                <Lock className="h-5 w-5 mr-2" />
                Choisir un plan premium
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-primary text-primary hover:bg-primary/5">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Essai gratuit manuel
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pricing" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="pricing">Tarifs Premium</TabsTrigger>
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

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Prêt à automatiser votre business ?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Rejoignez des milliers d'entrepreneurs qui utilisent notre IA pour créer et gérer leurs boutiques en ligne.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/pricing">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Choisir un plan premium
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
