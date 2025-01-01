import { Award, Home, Package, Settings, ShoppingCart, Users } from "lucide-react";

export const navigationItems = [
  {
    title: "Tableau de bord",
    url: "/tableau-de-bord",
    icon: Home,
  },
  {
    title: "Commandes",
    url: "/commandes",
    icon: Package,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Produits",
    url: "/produits",
    icon: ShoppingCart,
  },
  {
    title: "Programme de fidélité",
    url: "/fidelite",
    icon: Award,
  },
  {
    title: "Paramètres",
    url: "/parametres",
    icon: Settings,
  },
];