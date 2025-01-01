import { Theme } from "@/types/theme";

export const themes: Record<'free' | 'private', Theme> = {
  free: {
    name: "Thème Basique",
    description: "Un design simple et fonctionnel pour démarrer votre boutique",
    features: [
      "Design responsive",
      "Navigation simple",
      "Compatible mobile",
      "Performances optimisées"
    ],
    preview: "/placeholder.svg",
    colors: {
      primary: "#8E9196",
      secondary: "#E2E8F0",
      accent: "#F7FAFC",
      background: "#FFFFFF"
    },
    price: 0
  },
  private: {
    name: "Thème Premium Pro",
    description: "Un thème exclusif avec des fonctionnalités avancées pour une boutique professionnelle",
    features: [
      "Animations personnalisées premium",
      "Mise en page professionnelle",
      "Effets visuels exclusifs",
      "Options de personnalisation avancées",
      "Support prioritaire 24/7",
      "Mises à jour régulières",
      "SEO optimisé",
      "Intégration réseaux sociaux",
      "Analyses avancées"
    ],
    preview: "/placeholder.svg",
    colors: {
      primary: "#8B5CF6",
      secondary: "#D6BCFA",
      accent: "#F3E8FF",
      background: "#FFFFFF"
    },
    price: 49
  }
};