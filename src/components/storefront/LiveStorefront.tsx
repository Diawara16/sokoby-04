import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { SectionRenderer } from "./sections/SectionRenderer";
import { useStorefrontEngine } from "@/hooks/useStorefrontEngine";

interface LiveStorefrontProps {
  products: Product[];
  storeName: string | null;
  isLoading: boolean;
  storeId?: string | null;
}

export function LiveStorefront({ products, storeName, isLoading, storeId }: LiveStorefrontProps) {
  const { sections, isLoading: isEngineLoading } = useStorefrontEngine(storeId);

  const loading = isLoading || isEngineLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Store Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">{storeName || "Ma Boutique"}</h1>
          </div>
          <Link to="/tableau-de-bord">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Gérer ma boutique
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sections.length > 0 ? (
          <SectionRenderer sections={sections} products={products} storeName={storeName} />
        ) : (
          <div className="text-center py-16 space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold text-muted-foreground">
              Aucun produit disponible pour le moment
            </h2>
          </div>
        )}
      </main>
    </div>
  );
}
