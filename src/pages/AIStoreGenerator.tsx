import { Helmet } from "react-helmet";
import { AIStoreWizard } from "@/components/ai-store/AIStoreWizard";
import { KPIDashboard } from "@/components/ai-store/KPIDashboard";
import { Card } from "@/components/ui/card";

export default function AIStoreGenerator() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-5xl">
      <Helmet>
        <title>Créer ma boutique IA | Sokoby</title>
        <meta name="description" content="Créez une boutique en ligne complète en moins de 5 minutes avec l'IA Sokoby." />
      </Helmet>

      <div className="text-center mb-8 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          ⚡ Créez votre boutique en 5 minutes
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          L'IA génère votre niche, vos produits, votre design et votre stratégie marketing — vous n'avez qu'à cliquer.
        </p>
      </div>

      {/* Pricing banner */}
      <Card className="p-4 mb-8 text-center bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <p className="text-sm font-semibold text-foreground">
          💰 Commencez gratuitement — payez quand vous réalisez votre première vente
        </p>
      </Card>

      <AIStoreWizard />

      <div className="mt-12">
        <KPIDashboard />
      </div>
    </div>
  );
}
