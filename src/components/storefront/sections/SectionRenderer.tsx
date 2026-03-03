import React from "react";
import { HeroSection } from "./HeroSection";
import { FeaturedProductsSection } from "./FeaturedProductsSection";
import { NewsletterSection } from "./NewsletterSection";
import { Product } from "@/types/product";

interface Section {
  id: string;
  section_type: string;
  display_order: number;
  config: Record<string, any>;
  is_visible: boolean;
}

interface SectionRendererProps {
  sections: Section[];
  products: Product[];
  storeName?: string | null;
}

export function SectionRenderer({ sections, products, storeName }: SectionRendererProps) {
  const visibleSections = sections
    .filter((s) => s.is_visible)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <>
      {visibleSections.map((section) => {
        switch (section.section_type) {
          case "hero":
            return <HeroSection key={section.id} config={section.config} storeName={storeName} />;
          case "featured_products":
            return <FeaturedProductsSection key={section.id} config={section.config} products={products} />;
          case "newsletter":
            return <NewsletterSection key={section.id} config={section.config} />;
          default:
            return null;
        }
      })}
    </>
  );
}
