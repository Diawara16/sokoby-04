import { ShoppingBag, Instagram, Facebook, Video } from "lucide-react";
import { PlatformConfig } from '../types/platform';

export const socialPlatforms: PlatformConfig[] = [
  {
    name: "Instagram Shopping",
    icon: <Instagram className="h-5 w-5" />,
    description: "Vendez vos produits directement sur Instagram. Synchronisez votre catalogue et gérez vos commandes depuis votre tableau de bord.",
    status: 'pending',
    features: [
      "Synchronisation du catalogue produits",
      "Gestion des commandes Instagram",
      "Statistiques de vente",
      "Tags produits dans les posts"
    ],
    message: "Configuration de l'intégration Instagram Shopping en cours"
  },
  {
    name: "Facebook Shop",
    icon: <Facebook className="h-5 w-5" />,
    description: "Créez votre boutique Facebook et vendez directement sur le plus grand réseau social au monde.",
    status: 'pending',
    features: [
      "Catalogue produits synchronisé",
      "Boutique Facebook personnalisée",
      "Paiements intégrés",
      "Statistiques détaillées"
    ],
    message: "Configuration de l'intégration Facebook Shop en cours"
  },
  {
    name: "TikTok Shop",
    icon: <Video className="h-5 w-5" />,
    description: "Vendez vos produits sur TikTok et profitez de sa communauté dynamique pour augmenter vos ventes.",
    status: 'pending',
    features: [
      "Intégration du catalogue produits",
      "Gestion des commandes TikTok",
      "Statistiques en temps réel",
      "Création de contenus sponsorisés"
    ],
    message: "Configuration de l'intégration TikTok Shop en cours"
  }
];