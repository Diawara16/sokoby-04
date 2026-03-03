import React from "react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  config: {
    title?: string;
    subtitle?: string;
    cta_text?: string;
    cta_link?: string;
    background_image?: string;
  };
  storeName?: string | null;
}

export function HeroSection({ config, storeName }: HeroSectionProps) {
  const title = config.title || storeName || "Bienvenue";
  const subtitle = config.subtitle || "Découvrez nos produits";
  const ctaText = config.cta_text || "Voir les produits";
  const ctaLink = config.cta_link || "#featured-products";

  return (
    <section
      className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20 px-4"
      style={
        config.background_image
          ? { backgroundImage: `url(${config.background_image})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      {config.background_image && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">{title}</h1>
        <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">{subtitle}</p>
        <Button size="lg" variant="secondary" asChild>
          <a href={ctaLink}>{ctaText}</a>
        </Button>
      </div>
    </section>
  );
}
