import { 
  Home,
  ShoppingBag,
  User,
  Package,
  Award,
  FileText
} from "lucide-react"

export const navigationItems = [
  {
    title: "Tableau de bord",
    url: "/tableau-de-bord",
    icon: Home,
  },
  {
    title: "Commandes",
    url: "/suivi-commande",
    icon: ShoppingBag,
  },
  {
    title: "Profil",
    url: "/profil",
    icon: User,
  },
  {
    title: "Produits",
    url: "/produits",
    icon: Package,
  },
  {
    title: "Programme Fidélité",
    url: "/fidelite",
    icon: Award,
  },
  {
    title: "Blog Manager",
    url: "/blog-manager",
    icon: FileText,
  },
]