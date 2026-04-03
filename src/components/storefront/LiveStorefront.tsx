import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { useStorefrontEngine } from "@/hooks/useStorefrontEngine";
import { StoreVideoPlayer } from "./StoreVideoPlayer";
import { StorefrontProductGrid } from "./StorefrontProductGrid";

interface LiveStorefrontProps {
  products: Product[];
  storeName: string | null;
  isLoading: boolean;
  storeId?: string | null;
}

export function LiveStorefront({ products, storeName, isLoading, storeId }: LiveStorefrontProps) {
  const { isLoading: isEngineLoading } = useStorefrontEngine(storeId);
  const loading = isLoading || isEngineLoading;

  const featuredProducts = products.slice(0, 6);
  const allProducts = products;

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Store Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">{storeName || "Ma Boutique"}</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#featured-products" className="hover:text-foreground transition-colors">Nouveautés</a>
            <a href="#all-products" className="hover:text-foreground transition-colors">Tous les produits</a>
          </nav>
          <Link to="/tableau-de-bord">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Gérer
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Video Section — 80vh */}
      {storeId && (
        <StoreVideoPlayer storeId={storeId} storeName={storeName} />
      )}

      {/* Main Content */}
      <main>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <section id="featured-products" className="py-20 md:py-28 px-6">
                <div className="container mx-auto max-w-7xl">
                  <div className="text-center mb-12 animate-fade-in">
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
                      Sélection
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                      Nos produits vedettes
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                      Découvrez notre sélection exclusive de produits soigneusement choisis pour vous.
                    </p>
                  </div>
                  <StorefrontProductGrid products={featuredProducts} />
                </div>
              </section>
            )}

            {/* Divider */}
            {allProducts.length > 6 && (
              <div className="container mx-auto max-w-7xl px-6">
                <div className="border-t border-border" />
              </div>
            )}

            {/* All Products */}
            {allProducts.length > 6 && (
              <section id="all-products" className="py-20 md:py-28 px-6">
                <div className="container mx-auto max-w-7xl">
                  <div className="text-center mb-12 animate-fade-in">
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
                      Collection complète
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                      Tous nos produits
                    </h2>
                  </div>
                  <StorefrontProductGrid products={allProducts} />
                </div>
              </section>
            )}

            {/* Empty State */}
            {products.length === 0 && (
              <div className="text-center py-24 space-y-4 animate-fade-in">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40" />
                <h2 className="text-xl font-semibold text-muted-foreground">
                  Aucun produit disponible pour le moment
                </h2>
                <p className="text-sm text-muted-foreground">
                  Revenez bientôt pour découvrir notre collection.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-10 px-6 mt-8">
        <div className="container mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {storeName || "Ma Boutique"}. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
