import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  Users, 
  Mail,
  Grid,
  Share2,
  BarChart,
  Settings,
  Bell,
  Plug,
  Bot,
  Wand2,
  CreditCard
} from "lucide-react";

export const sidebarItems = [
  { 
    icon: LayoutDashboard, 
    label: "Tableau de bord", 
    href: "/" 
  },
  { 
    icon: Package, 
    label: "Produits", 
    href: "/products" 
  },
  { 
    icon: ShoppingCart, 
    label: "Commandes", 
    href: "/orders" 
  },
  { 
    icon: Users, 
    label: "Clients", 
    href: "/clients" 
  },
  { 
    icon: BarChart, 
    label: "Statistiques", 
    href: "/analytics" 
  },
  { 
    icon: CreditCard, 
    label: "Paiements", 
    href: "/payments" 
  },
  { 
    icon: Mail, 
    label: "Marketing", 
    href: "/email-marketing" 
  },
  { 
    icon: Settings, 
    label: "Paramètres", 
    href: "/parametres" 
  },
  // Autres éléments existants conservés ci-dessous
  { 
    icon: Store, 
    label: "Boutique", 
    href: "/boutique"
  },
  {
    icon: Bot,
    label: "Boutique IA",
    href: "/boutique-ia",
    className: "text-primary hover:text-primary/90"
  },
  {
    icon: Wand2,
    label: "Créer ma boutique IA",
    href: "/creer-boutique-ia",
    className: "text-primary hover:text-primary/90 font-semibold"
  },
  { 
    icon: Grid, 
    label: "Applications", 
    href: "/applications" 
  },
  { 
    icon: Plug, 
    label: "Intégrations", 
    href: "/integrations" 
  },
  { 
    icon: Share2, 
    label: "Canaux de vente", 
    href: "/vente-multicanale" 
  },
  { 
    icon: Bell, 
    label: "Notifications", 
    href: "/notifications" 
  }
];
