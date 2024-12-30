import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users,
  BarChart,
  LineChart,
  TrendingUp,
  Activity,
  Truck,
  CreditCard,
  Tags,
  Box,
  ArrowLeftRight,
  Gift,
  UserSearch,
  UserPlus,
  UserCheck,
  ShoppingBag,
  AppWindow,
  Info,
  Sparkles,
  PlusCircle,
  Globe,
  Settings,
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
        icon: Box,
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
    subItems: [
      {
        title: "Vue d'ensemble",
        url: "/clientele/apercu",
        icon: UserSearch,
        description: "Analysez votre base clients"
      },
      {
        title: "Groupes d'acheteurs",
        url: "/clientele/groupes",
        icon: UserPlus,
        description: "Créez des groupes personnalisés"
      },
      {
        title: "Fidélisation",
        url: "/clientele/fidelisation",
        icon: UserCheck,
        description: "Gérez vos programmes de fidélité"
      }
    ]
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
    title: "Analyses",
    url: "/analyses",
    icon: BarChart,
    subItems: [
      {
        title: "Tableau de bord",
        url: "/analyses/tableau-de-bord",
        icon: Activity,
        description: "Vue d'ensemble des performances"
      },
      {
        title: "Tendances",
        url: "/analyses/tendances",
        icon: TrendingUp,
        description: "Analyse des tendances de vente"
      },
      {
        title: "Rapports avancés",
        url: "/analyses/rapports",
        icon: LineChart,
        description: "Rapports détaillés et exports"
      }
    ]
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