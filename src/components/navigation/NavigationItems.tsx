import { 
  Home, 
  CreditCard, 
  Palette, 
  BookOpen, 
  MessageSquare,
  Users,
  Settings,
  DollarSign,
  MapPin,
  Store,
  ShoppingBag,
  BarChart,
  Mail,
  Bell,
  Bot,
  Share2,
  LayoutGrid
} from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: any;
  openInNewWindow?: boolean;
  className?: string;
  subItems?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home
  },
  {
    title: "Boutique",
    url: "/boutique",
    icon: Store
  },
  {
    title: "Créer ma boutique IA",
    url: "/creer-boutique-ia",
    icon: Bot,
    className: "text-primary hover:text-primary/90"
  },
  {
    title: "Produits",
    url: "/produits",
    icon: ShoppingBag
  },
  {
    title: "Commandes",
    url: "/commandes",
    icon: CreditCard
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
    subItems: [
      {
        title: "Vue d'ensemble",
        url: "/clients/vue-ensemble",
        icon: Users
      },
      {
        title: "Détails",
        url: "/clients/details",
        icon: Users
      },
      {
        title: "Groupes",
        url: "/clients/groupes",
        icon: Users
      },
      {
        title: "Fidélité",
        url: "/clients/fidelite",
        icon: Users
      }
    ]
  },
  {
    title: "Email Marketing",
    url: "/email-marketing",
    icon: Mail
  },
  {
    title: "Applications",
    url: "/applications",
    icon: LayoutGrid
  },
  {
    title: "Canaux de vente",
    url: "/vente-multicanale",
    icon: Share2
  },
  {
    title: "Analytiques",
    url: "/analytiques",
    icon: BarChart
  },
  {
    title: "Paramètres",
    url: "/parametres",
    icon: Settings,
    subItems: [
      {
        title: "Utilisateurs",
        url: "/parametres/utilisateurs",
        icon: Users
      },
      {
        title: "Paiements",
        url: "/parametres/paiements",
        icon: DollarSign
      },
      {
        title: "Géolocalisation",
        url: "/parametres/geolocalisation",
        icon: MapPin
      }
    ]
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell
  }
];