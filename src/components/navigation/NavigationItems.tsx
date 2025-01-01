import { Award, Home, Package, Settings, ShoppingCart, Users } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  openInNewWindow?: boolean;
  className?: string;
}

export const navigationItems: NavigationItem[] = [
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