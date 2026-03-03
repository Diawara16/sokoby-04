import React from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Product } from "@/types/product";

interface FeaturedProductsSectionProps {
  config: {
    title?: string;
    subtitle?: string;
    max_products?: number;
  };
  products: Product[];
}

export function FeaturedProductsSection({ config, products }: FeaturedProductsSectionProps) {
  const title = config.title || "Nos Produits";
  const subtitle = config.subtitle;
  const maxProducts = config.max_products || 50;
  const displayProducts = products.slice(0, maxProducts);

  return (
    <section id="featured-products" className="py-16 px-4 bg-background">
      <div className="container mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          <p className="text-muted-foreground text-sm">
            {displayProducts.length} produit{displayProducts.length > 1 ? "s" : ""} disponible{displayProducts.length > 1 ? "s" : ""}
          </p>
        </div>
        {displayProducts.length > 0 ? (
          <ProductGrid products={displayProducts} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun produit disponible pour le moment.
          </div>
        )}
      </div>
    </section>
  );
}
