import { ShoppingBag, Share2 } from "lucide-react";
import { PlatformConfig } from "../types/platform";

export const socialPlatforms: PlatformConfig[] = [
  {
    name: "TikTok Shop",
    icon: <ShoppingBag className="h-5 w-5" />,
    description: "Vendez vos produits directement sur TikTok Shop",
    status: "pending",
    features: [
      "Synchronisation du catalogue",
      "Gestion des commandes",
      "Statistiques de vente"
    ]
  },
  {
    name: "Instagram Shop",
    icon: <Share2 className="h-5 w-5" />,
    description: "Intégrez votre boutique à Instagram",
    status: "coming_soon",
    message: "L'intégration Instagram sera bientôt disponible"
  }
];