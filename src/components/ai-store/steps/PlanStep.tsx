import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LayoutGrid, Search, ShoppingBag, Rocket } from "lucide-react";
import type { AIStoreData } from "../AIStoreWizard";

interface PlanStepProps {
  data: AIStoreData;
  onNext: () => void;
  onBack: () => void;
  isGenerating?: boolean;
}

export function PlanStep({ data, onNext, onBack, isGenerating = false }: PlanStepProps) {
  const categories = [...new Set(data.products.map((p) => p.category))];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Plan de votre boutique</h2>
        <p className="text-muted-foreground">Produits, catégories et SEO — tout est prêt</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <ShoppingBag className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{data.products.length}</p>
          <p className="text-xs text-muted-foreground">Produits</p>
        </Card>
        <Card className="p-4 text-center">
          <LayoutGrid className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{categories.length}</p>
          <p className="text-xs text-muted-foreground">Catégories</p>
        </Card>
        <Card className="p-4 text-center">
          <Search className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">✓</p>
          <p className="text-xs text-muted-foreground">SEO Optimisé</p>
        </Card>
      </div>

      {/* Product grid */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-foreground">Produits suggérés</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <Badge key={cat} variant="secondary">{cat}</Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {data.products.map((product, i) => (
            <div key={i} className="p-3 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
              <div
                className="w-full h-16 rounded-md mb-2"
                style={{ backgroundColor: data.accentColor + "15" }}
              />
              <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
              <p className="text-xs font-bold mt-1" style={{ color: data.accentColor }}>
                {product.price.toFixed(2)} €
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* SEO preview */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3 text-foreground">Aperçu SEO</h3>
        <div className="p-4 rounded-lg bg-muted space-y-1">
          <p className="text-sm font-medium text-blue-600">{data.storeName} — Achat en ligne</p>
          <p className="text-xs text-green-700">sokoby.com/{data.niche}</p>
          <p className="text-xs text-muted-foreground">
            {data.slogan}. Découvrez nos {data.products.length} produits sélectionnés avec soin. Livraison rapide.
          </p>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        <Button onClick={onNext} size="lg" className="bg-primary text-primary-foreground font-semibold px-8" disabled={isGenerating}>
          <Rocket className="h-4 w-4 mr-2" /> {isGenerating ? "Génération en cours…" : "Générer ma boutique maintenant"}
        </Button>
      </div>
    </div>
  );
}
