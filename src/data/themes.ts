import { Theme } from "@/types/theme";

export const themes: Record<'free' | 'private', Theme> = {
  free: {
    name: "Thème Gratuit",
    description: "Un design élégant et professionnel pour votre boutique",
    features: [
      "Design responsive",
      "Palette de couleurs harmonieuse",
      "Navigation intuitive",
      "Optimisé pour mobile"
    ],
    preview: "/placeholder.svg",
    colors: {
      primary: "#8E9196",
      secondary: "#D6BCFA",
      accent: "#F2FCE2",
      background: "#FFFFFF"
    },
    price: 0
  },
  private: {
    name: "Thème Premium",
    description: "Un thème exclusif avec des fonctionnalités avancées",
    features: [
      "Animations personnalisées",
      "Mise en page premium",
      "Effets visuels exclusifs",
      "Options de personnalisation avancées",
      "Support prioritaire",
      "Mises à jour régulières"
    ],
    preview: "/placeholder.svg",
    colors: {
      primary: "#1A1F2C",
      secondary: "#7E69AB",
      accent: "#F1F0FB",
      background: "#221F26"
    },
    price: 79
  }
};