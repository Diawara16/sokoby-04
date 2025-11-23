
import { Bot, Sparkles } from "lucide-react";

interface StoreHeaderProps {
  title?: string;
  description?: string;
}

export const StoreHeader = ({ 
  title = "Créez votre boutique automatisée",
  description = "Notre IA va générer une boutique complète et optimisée pour votre niche, avec des produits pertinents et des descriptions détaillées."
}: StoreHeaderProps) => {
  return (
    <div className="text-center space-y-3 sm:space-y-4 px-4">
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base font-medium">Boutique IA</span>
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-heading px-4">
        {title}
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
        {description}
      </p>
    </div>
  );
};
