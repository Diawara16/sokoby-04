import React from "react";
import { Product } from "@/types/product";
import { useStorefrontEngine } from "@/hooks/useStorefrontEngine";
import { StoreVideoPlayer } from "./StoreVideoPlayer";
import { StorefrontProductGrid } from "./StorefrontProductGrid";
import { PremiumNavbar } from "./PremiumNavbar";
import { PremiumFooter } from "./PremiumFooter";
import { TrustSection } from "./TrustSection";
import { ShoppingBag } from "lucide-react";

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
    <div className="min-h-screen bg-white">
      {/* Premium Navbar */}
      <PremiumNavbar storeName={storeName} />

      {/* Hero Video */}
      {storeId && <StoreVideoPlayer storeId={storeId} storeName={storeName} />}

      {/* Main Content */}
      <main>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900" />
          </div>
        ) : (
          <>
            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <section id="featured-products" className="py-20 md:py-28 px-6">
                <div className="max-w-[1200px] mx-auto">
                  <div className="text-center mb-14 animate-fade-in">
                    <p className="text-xs font-semibold uppercase tracking-[3px] text-neutral-400 mb-3">
                      Curated Selection
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
                      Featured Products
                    </h2>
                  </div>
                  <StorefrontProductGrid products={featuredProducts} />
                </div>
              </section>
            )}

            {/* All Products */}
            {allProducts.length > 6 && (
              <section id="all-products" className="py-20 md:py-28 px-6">
                <div className="max-w-[1200px] mx-auto">
                  <div className="text-center mb-14 animate-fade-in">
                    <p className="text-xs font-semibold uppercase tracking-[3px] text-neutral-400 mb-3">
                      Full Collection
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
                      All Products
                    </h2>
                  </div>
                  <StorefrontProductGrid products={allProducts} />
                </div>
              </section>
            )}

            {/* Trust */}
            <TrustSection />

            {/* Empty State */}
            {products.length === 0 && (
              <div className="text-center py-24 space-y-4 animate-fade-in">
                <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300" />
                <h2 className="text-xl font-semibold text-neutral-500">
                  No products available yet
                </h2>
                <p className="text-sm text-neutral-400">
                  Check back soon for our latest collection.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Premium Footer */}
      <PremiumFooter storeName={storeName} />
    </div>
  );
}
