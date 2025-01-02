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
  Bell
} from "lucide-react";

export const navigationItems = [
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
    icon: Users
  },
  {
    title: "Marketing",
    url: "/marketing",
    icon: Mail
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