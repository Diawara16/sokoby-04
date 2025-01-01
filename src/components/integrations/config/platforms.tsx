import { Instagram, ShoppingBag, Facebook } from 'lucide-react';
import { PlatformConfig } from '../types/platform';

export const platforms: PlatformConfig[] = [
  {
    name: "Instagram Shopping",
    icon: <Instagram className="h-5 w-5" />,
    description: "Connectez votre catalogue produits à Instagram Shopping",
    status: 'pending',
    message: "Configuration requise du compte Instagram Business"
  },
  {
    name: "Facebook Shop",
    icon: <Facebook className="h-5 w-5" />,
    description: "Vendez vos produits directement sur Facebook",
    status: 'pending',
    message: "Configuration requise du compte Facebook Business"
  },
  {
    name: "TikTok Shop",
    icon: <ShoppingBag className="h-5 w-5" />,
    description: "Intégrez votre boutique avec TikTok Shop pour vendre directement sur TikTok",
    status: 'coming_soon',
    message: "TikTok Shop sera bientôt disponible dans votre région"
  }
];