
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Wand2, Sparkles, ShoppingBag, Zap, TrendingUp } from "lucide-react";
import { AIStoreDialog } from "@/components/store-creation/AIStoreDialog";

export function AIStoreSection() {
  const [aiDialogOpen, setAIDialogOpen] = useState(false);
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "IA Générative",
      description: "Notre IA crée automatiquement votre boutique avec des produits optimisés"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Déploiement Rapide",
      description: "Votre boutique est prête en quelques minutes, pas en semaines"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Optimisation Continue",
      description: "L'IA améliore constamment vos descriptions et votre SEO"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 px-4 py-2">
              <Bot className="h-4 w-4 mr-2" />
              Powered by AI
              <Sparkles className="h-4 w-4 ml-2" />
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Créez votre <span className="text-primary">Boutique IA</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Laissez notre intelligence artificielle créer une boutique complète et optimisée 
            pour votre niche en quelques minutes seulement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold"
              onClick={() => setAIDialogOpen(true)}
            >
              <Wand2 className="h-5 w-5 mr-2" />
              Créer ma boutique IA
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold border-primary text-primary hover:bg-primary/5"
              onClick={() => setAIDialogOpen(true)}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Découvrir la boutique IA
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Paiement sécurisé via Shopify Checkout
          </p>
        </div>
      </div>

      <AIStoreDialog
        open={aiDialogOpen}
        onOpenChange={setAIDialogOpen}
        onCheckout={() => {}}
      />
    </section>
  );
}
