import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  ShoppingBag, 
  AppWindow, 
  Settings, 
  Sparkles, 
  Globe, 
  PlusCircle, 
  Info,
  Truck,
  CreditCard,
  BoxIcon,
  Tags,
  ArrowLeftRight,
  Gift
} from "lucide-react"

export const navigationItems = [
  {
    title: "Accueil",
    url: "/tableau-de-bord",
    icon: Home,
  },
  {
    title: "Commandes",
    url: "/commandes",
    icon: ShoppingCart,
    subItems: [
      {
        title: "Commandes provisoires",
        url: "/commandes/provisoires",
        icon: Package,
      },
      {
        title: "Étiquettes d'expédition",
        url: "/commandes/expeditions",
        icon: Truck,
      },
      {
        title: "Paiements abandonnés",
        url: "/commandes/abandonnes",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Produits",
    url: "/produits",
    icon: Package,
    subItems: [
      {
        title: "Catalogue produits",
        url: "/produits/catalogue",
        icon: Tags,
      },
      {
        title: "Gestion du stock",
        url: "/produits/stock",
        icon: BoxIcon,
      },
      {
        title: "Mouvements produits",
        url: "/produits/mouvements",
        icon: ArrowLeftRight,
      },
      {
        title: "Cartes cadeaux",
        url: "/produits/cartes-cadeaux",
        icon: Gift,
      },
    ],
  },
  {
    title: "Clientèle",
    url: "/clientele",
    icon: Users,
  },
  {
    title: "Boutique en ligne",
    url: "/boutique",
    icon: ShoppingBag,
    openInNewWindow: true,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: AppWindow,
  },
  {
    title: "Qui sommes-nous?",
    url: "/qui-sommes-nous",
    icon: Info,
  },
  {
    title: "Boutique IA",
    url: "/creer-boutique-ia",
    icon: Sparkles,
    className: "mt-4",
  },
  {
    title: "Acheter un domaine",
    url: "/acheter-domaine",
    icon: PlusCircle,
  },
  {
    title: "Connecter un domaine",
    url: "/connecter-domaine",
    icon: Globe,
  },
  {
    title: "Paramètres",
    url: "/parametres",
    icon: Settings,
    className: "mt-4",
  },
]
