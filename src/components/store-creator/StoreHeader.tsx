import { Bot, Sparkles } from "lucide-react";

export const StoreHeader = () => {
  return (
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
  );
};