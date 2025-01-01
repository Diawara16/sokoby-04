import {
  LayoutDashboard,
  ShoppingCart,
  Settings,
  UserCircle,
  Award,
  FileText,
  BookOpen,
  Mail,
  Sparkles,
  Truck,
  LucideIcon
} from "lucide-react"

export interface NavigationItem {
  title: string
  url: string
  icon: LucideIcon
  openInNewWindow?: boolean
  className?: string
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/tableau-de-bord",
    icon: LayoutDashboard
  },
  {
    title: "Boutique",
    url: "/boutique",
    icon: ShoppingCart
  },
  {
    title: "Logistique",
    url: "/logistique",
    icon: Truck
  },
  {
    title: "Paramètres",
    url: "/parametres",
    icon: Settings
  },
  {
    title: "Profil",
    url: "/profil",
    icon: UserCircle
  },
  {
    title: "Fidélité",
    url: "/fidelite",
    icon: Award
  },
  {
    title: "Email Marketing",
    url: "/email-marketing",
    icon: Mail
  },
  {
    title: "Recommandations",
    url: "/recommandations",
    icon: Sparkles
  },
  {
    title: "Blog Manager",
    url: "/blog-manager",
    icon: FileText
  },
  {
    title: "Guides",
    url: "/guides",
    icon: BookOpen
  }
]