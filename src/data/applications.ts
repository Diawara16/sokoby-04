import { Facebook, Instagram, ShoppingBag, Video, Store, PinIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Application {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  authUrl: string;
  price?: {
    monthly: number;
    annual?: number;
  };
}

export const applications: Application[] = [
  {
    id: "facebook",
    name: "Facebook Shop",
    description: "Vendez vos produits directement sur Facebook",
    icon: Facebook,
    authUrl: "/auth/facebook",
    price: {
      monthly: 9.99
    }
  },
  {
    id: "instagram",
    name: "Instagram Shopping",
    description: "Transformez votre compte Instagram en boutique",
    icon: Instagram,
    authUrl: "/auth/instagram",
    price: {
      monthly: 9.99
    }
  },
  {
    id: "tiktok",
    name: "TikTok Shop",
    description: "Vendez sur TikTok et touchez une audience plus jeune",
    icon: Video,
    authUrl: "/auth/tiktok",
    price: {
      monthly: 14.99
    }
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "Vendez sur la plus grande marketplace au monde",
    icon: ShoppingBag,
    authUrl: "/auth/amazon",
    price: {
      monthly: 29.99,
      annual: 299.99
    }
  },
  {
    id: "ebay",
    name: "eBay",
    description: "Atteignez des millions d'acheteurs sur eBay",
    icon: ShoppingBag,
    authUrl: "/auth/ebay",
    price: {
      monthly: 19.99,
      annual: 199.99
    }
  },
  {
    id: "walmart",
    name: "Walmart Marketplace",
    description: "Vendez vos produits sur Walmart.com",
    icon: Store,
    authUrl: "/auth/walmart",
    price: {
      monthly: 29.99,
      annual: 299.99
    }
  },
  {
    id: "pinterest",
    name: "Pinterest Shopping",
    description: "Transformez vos épingles en opportunités de vente",
    icon: PinIcon,
    authUrl: "/auth/pinterest",
    price: {
      monthly: 9.99
    }
  }
];