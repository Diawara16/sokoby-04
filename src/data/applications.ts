import { ShoppingBag, Star, TrendingUp, Truck, Image, Package } from "lucide-react";

export const applications = [
  {
    id: 1,
    name: "DSERS-Aliexpress",
    description: "Importez et gérez facilement des produits Aliexpress",
    icon: ShoppingBag,
    authUrl: "https://login.dsers.com/oauth/authorize",
    price: {
      monthly: 29,
      annual: 290,
    }
  },
  {
    id: 2,
    name: "Zendrop",
    description: "Solution complète de dropshipping et fulfillment",
    icon: Truck,
    authUrl: "https://app.zendrop.com/oauth/authorize",
    price: {
      monthly: 39,
      annual: 390,
    }
  },
  {
    id: 3,
    name: "Loox",
    description: "Avis photos et vidéos de clients",
    icon: Image,
    authUrl: "https://admin.loox.io/oauth/authorize",
    price: {
      monthly: 19,
      annual: 190,
    }
  },
  {
    id: 4,
    name: "TikTok Shop",
    description: "Vendez vos produits directement sur TikTok",
    icon: TrendingUp,
    authUrl: "https://auth.tiktok-shops.com/oauth/authorize",
    price: {
      monthly: 49,
      annual: 490,
    }
  },
  {
    id: 5,
    name: "AliReviews",
    description: "Importez des avis Aliexpress sur votre boutique",
    icon: Star,
    authUrl: "https://app.alireviews.io/oauth/authorize",
    price: {
      monthly: 19,
      annual: 190,
    }
  },
  {
    id: 6,
    name: "CJDropshipping",
    description: "Plateforme complète de dropshipping et fulfillment",
    icon: Package,
    authUrl: "https://developers.cjdropshipping.com/oauth2/authorize",
    price: {
      monthly: 39,
      annual: 390,
    }
  },
];