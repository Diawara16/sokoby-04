import React from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Settings, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";

interface LiveStorefrontProps {
  products: Product[];
  storeName: string | null;
  isLoading: boolean;
}

export function LiveStorefront({ products, storeName, isLoading }: LiveStorefrontProps) {
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
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Nos Produits</h2>
              <p className="text-muted-foreground">
                {products.length} produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
              </p>
            </div>
            <ProductGrid products={products} />
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold text-muted-foreground">
              Aucun produit disponible pour le moment
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Revenez bientôt pour découvrir nos produits !
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
