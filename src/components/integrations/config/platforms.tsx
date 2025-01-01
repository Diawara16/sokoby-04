import { ShoppingBag, Instagram, Facebook } from "lucide-react"
import { PlatformConfig } from '../types/platform'

export const socialPlatforms: PlatformConfig[] = [
  {
    name: "Instagram Shopping",
    icon: <Instagram className="h-5 w-5" />,
    description: "Vendez vos produits directement sur Instagram",
    status: 'pending',
    message: "En attente de validation du compte professionnel et catalogue produits"
  },
  {
    name: "Facebook Shop",
    icon: <Facebook className="h-5 w-5" />,
    description: "Créez votre boutique sur Facebook",
    status: 'pending',
    message: "En attente de validation du compte business et catalogue produits"
  },
  {
    name: "TikTok Shop",
    icon: <ShoppingBag className="h-5 w-5" />,
    description: "Intégrez votre boutique avec TikTok Shop pour synchroniser vos stocks et optimiser vos prix",
    features: [
      "Synchronisation en temps réel des stocks",
      "Prix dynamiques basés sur la concurrence"
    ],
    status: 'coming_soon',
    message: "Configuration de l'intégration TikTok Shop en cours"
  }
];