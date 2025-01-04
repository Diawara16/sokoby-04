import { ShoppingBag, Share2, BrandTiktok } from "lucide-react";
import { PlatformConfig } from "../types/platform";

export const socialPlatforms: PlatformConfig[] = [
  {
    name: "TikTok Shop",
    icon: <BrandTiktok className="h-5 w-5" />,
    description: "Vendez vos produits directement sur TikTok Shop",
    status: "pending",
    features: [
      "Synchronisation du catalogue",
      "Gestion des commandes",
      "Statistiques de ventes"
    ]
  },
  {
    name: "Instagram Shopping",
    icon: <ShoppingBag className="h-5 w-5" />,
    description: "Intégrez votre catalogue avec Instagram Shopping",
    status: "coming_soon"
  },
  {
    name: "Pinterest Shopping",
    icon: <Share2 className="h-5 w-5" />,
    description: "Vendez vos produits sur Pinterest",
    status: "coming_soon"
  }
];