import { Theme } from "@/types/theme";

export const themes: Record<'free' | 'private', Theme> = {
  free: {
    id: "free-theme",
    name: "Thème Basique",
    description: "Un design simple et fonctionnel pour démarrer votre boutique",
    niche: "general",
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
    typography: {
      fontFamily: "Inter",
      fontSize: "16px",
      headingFont: "Poppins",
      bodyFont: "Inter"
    },
    layout: {
      spacing: "1rem",
      containerWidth: "1200px"
    },
    components: {
      buttons: {
        borderRadius: "0.375rem",
        padding: "0.5rem 1rem"
      },
      cards: {
        borderRadius: "0.5rem",
        shadow: "0 2px 4px rgba(0,0,0,0.1)"
      }
    },
    price: 0,
    created_at: new Date().toISOString()
  },
  private: {
    id: "premium-theme",
    name: "Thème Premium Pro",
    description: "Un thème exclusif avec des fonctionnalités avancées pour une boutique professionnelle",
    niche: "premium",
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
    typography: {
      fontFamily: "Montserrat",
      fontSize: "16px",
      headingFont: "Montserrat",
      bodyFont: "Inter"
    },
    layout: {
      spacing: "1.5rem",
      containerWidth: "1400px"
    },
    components: {
      buttons: {
        borderRadius: "0.5rem",
        padding: "0.75rem 1.5rem"
      },
      cards: {
        borderRadius: "0.75rem",
        shadow: "0 4px 6px rgba(0,0,0,0.1)"
      }
    },
    price: 49,
    created_at: new Date().toISOString()
  }
};