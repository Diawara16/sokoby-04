import React from "react";
import { Product } from "@/types/product";
import { Link } from "react-router-dom";

interface StorefrontProductGridProps {
  products: Product[];
}

export function StorefrontProductGrid({ products }: StorefrontProductGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
      {products.map((product, index) => (
        <StorefrontProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

function StorefrontProductCard({ product, index }: { product: Product; index: number }) {
  const imageUrl =
    product.image ||
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=500&fit=crop&q=80";

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-fade-in"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      <div
        className="rounded-[18px] overflow-hidden bg-white transition-all duration-500 group-hover:-translate-y-2"
        style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full aspect-[4/5] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=500&fit=crop&q=80";
            }}
          />
        </div>

        {/* Info */}
        <div className="p-5 space-y-1.5">
          <h3 className="font-medium text-sm text-neutral-800 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-base font-bold text-neutral-900">{product.price} €</p>
        </div>
      </div>
    </Link>
  );
}
