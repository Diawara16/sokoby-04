import { Facebook, Instagram, ShoppingBag, Video, Store, PinIcon, Truck, Package, Box } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Application {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  authUrl: string;
  type: "sales_channel" | "dropshipping";
  price?: {
    monthly: number;
    annual?: number;
  };
}

export const applications: Application[] = [
  // Canaux de vente
  {
    id: "facebook",
    name: "Facebook Shop",
    description: "Vendez vos produits directement sur Facebook",
    icon: Facebook,
    authUrl: "/auth/facebook",
    type: "sales_channel",
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
    type: "sales_channel",
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
    type: "sales_channel",
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
    type: "sales_channel",
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
    type: "sales_channel",
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
    type: "sales_channel",
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
    type: "sales_channel",
    price: {
      monthly: 9.99
    }
  },
  // Fournisseurs de dropshipping
  {
    id: "aliexpress",
    name: "AliExpress",
    description: "Accédez à des millions de produits à prix compétitifs",
    icon: Truck,
    authUrl: "/auth/aliexpress",
    type: "dropshipping",
    price: {
      monthly: 29.99,
      annual: 299.99
    }
  },
  {
    id: "cjdropshipping",
    name: "CJ Dropshipping",
    description: "Solution complète avec stockage et expédition rapide",
    icon: Package,
    authUrl: "/auth/cjdropshipping",
    type: "dropshipping",
    price: {
      monthly: 19.99,
      annual: 199.99
    }
  },
  {
    id: "spocket",
    name: "Spocket",
    description: "Produits de qualité d'Europe et des États-Unis",
    icon: Box,
    authUrl: "/auth/spocket",
    type: "dropshipping",
    price: {
      monthly: 24.99,
      annual: 249.99
    }
  },
  {
    id: "zendrop",
    name: "Zendrop",
    description: "Plateforme de dropshipping premium avec des produits de qualité",
    icon: Package,
    authUrl: "/auth/zendrop",
    type: "dropshipping",
    price: {
      monthly: 27.99,
      annual: 279.99
    }
  }
];