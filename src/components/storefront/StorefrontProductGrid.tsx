import React from "react";
import { Product } from "@/types/product";
import { Link } from "react-router-dom";

interface StorefrontProductGridProps {
  products: Product[];
}

export function StorefrontProductGrid({ products }: StorefrontProductGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <StorefrontProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

function StorefrontProductCard({ product, index }: { product: Product; index: number }) {
  const imageUrl =
    product.image ||
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop&q=80";

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-fade-in"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <div className="rounded-2xl overflow-hidden bg-card border border-border/50 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:border-primary/20">
        {/* Image */}
        <div className="relative overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop&q=80";
            }}
          />
          {/* Quick-view overlay */}
          {/* Permanent overlay */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-500" />
          {/* Quick-view overlay */}
          <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              Voir le produit
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-1.5">
          <h3 className="font-medium text-sm md:text-base text-card-foreground line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 hidden md:block">
              {product.description}
            </p>
          )}
          <p className="text-primary font-bold text-base">{product.price} €</p>
        </div>
      </div>
    </Link>
  );
}
