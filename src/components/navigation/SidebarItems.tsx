
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
  Wand2
} from "lucide-react";

export const sidebarItems = [
  { 
    icon: LayoutDashboard, 
    label: "Tableau de bord", 
    href: "/" 
  },
  { 
    icon: Store, 
    label: "Boutique", 
    href: "/boutique"
  },
  {
    icon: Bot,
    label: "Créer ma boutique IA",
    href: "/creer-boutique-ia",
    className: "text-primary hover:text-primary/90 font-semibold"
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
    icon: Mail, 
    label: "Email Marketing", 
    href: "/email-marketing" 
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
    icon: BarChart, 
    label: "Analytiques", 
    href: "/analytics" 
  },
  { 
    icon: Settings, 
    label: "Paramètres", 
    href: "/parametres" 
  },
  { 
    icon: Bell, 
    label: "Notifications", 
    href: "/notifications" 
  }
];
