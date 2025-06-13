
import { VendorAssistant } from "@/components/ai/VendorAssistant";
import { PriceOptimizer } from "@/components/ai/PriceOptimizer";
import { ProductImageGenerator } from "@/components/ai/ProductImageGenerator";
import { MarketingTools } from "@/components/ai/MarketingTools";
import { Bot, Sparkles, ShoppingBag, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BoutiqueIA() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 px-6 py-3 text-lg">
              <Bot className="h-6 w-6 mr-2" />
              Boutique IA
              <Sparkles className="h-5 w-5 ml-2" />
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 font-heading">
            Créez votre boutique automatisée
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre intelligence artificielle génère une boutique complète et optimisée pour votre niche, 
            avec des produits pertinents et des descriptions détaillées.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/creer-boutique-ia">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold">
                <Wand2 className="h-5 w-5 mr-2" />
                Créer ma boutique IA
              </Button>
            </Link>
            <Link to="/essai-gratuit">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-primary text-primary hover:bg-primary/5">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Essai gratuit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
          <VendorAssistant />
          <PriceOptimizer />
          <ProductImageGenerator />
          <MarketingTools />
        </div>

        <div className="text-center mt-16 bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Prêt à automatiser votre business ?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Rejoignez des milliers d'entrepreneurs qui utilisent notre IA pour créer et gérer leurs boutiques en ligne.
          </p>
          <Link to="/creer-boutique-ia">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
