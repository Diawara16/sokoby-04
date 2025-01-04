import { VendorAssistant } from "@/components/ai/VendorAssistant";
import { PriceOptimizer } from "@/components/ai/PriceOptimizer";
import { ProductImageGenerator } from "@/components/ai/ProductImageGenerator";
import { MarketingTools } from "@/components/ai/MarketingTools";
import { Bot, Sparkles } from "lucide-react";

export default function AIStore() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
              <span className="font-medium">Boutique IA</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 font-heading">
            Créez votre boutique automatisée
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Notre IA va générer une boutique complète et optimisée pour votre niche, avec des produits pertinents et des descriptions détaillées.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <VendorAssistant />
          <PriceOptimizer />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ProductImageGenerator />
          <MarketingTools />
        </div>
      </div>
    </div>
  );
}