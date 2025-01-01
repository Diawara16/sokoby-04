import { 
  Home, 
  LayoutDashboard, 
  ShoppingBag, 
  UserCircle, 
  Award,
  FileText,
  BookOpen
} from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface NavigationItem {
  title: string
  url: string
  icon: LucideIcon
  openInNewWindow?: boolean
  className?: string
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Tableau de bord",
    url: "/tableau-de-bord",
    icon: LayoutDashboard
  },
  {
    title: "Profil",
    url: "/profil",
    icon: UserCircle
  },
  {
    title: "Commandes",
    url: "/suivi-commande",
    icon: ShoppingBag
  },
  {
    title: "Fidélité",
    url: "/fidelite",
    icon: Award
  },
  {
    title: "Blog Manager",
    url: "/blog-manager",
    icon: FileText
  },
  {
    title: "Blog",
    url: "/blog",
    icon: BookOpen
  }
]