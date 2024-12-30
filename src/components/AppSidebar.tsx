import { Link, useLocation } from "react-router-dom"
import { Home, ShoppingCart, Package, Users, ShoppingBag, AppWindow, Settings, Sparkles, Globe, PlusCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Accueil",
    url: "/tableau-de-bord",
    icon: Home,
  },
  {
    title: "Commandes",
    url: "/commandes",
    icon: ShoppingCart,
  },
  {
    title: "Produits",
    url: "/produits",
    icon: Package,
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
    title: "Créer votre boutique par IA",
    url: "/creer-boutique-ia",
    icon: Sparkles,
    className: "mt-4", // Add space above this item
  },
  {
    title: "Acheter un nouveau domaine",
    url: "/acheter-domaine",
    icon: PlusCircle,
  },
  {
    title: "Connecter votre domaine existant",
    url: "/connecter-domaine",
    icon: Globe,
  },
  {
    title: "Paramètres",
    url: "/parametres",
    icon: Settings,
    className: "mt-4", // Keep space above settings
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent className="py-6">
        <SidebarMenu className="space-y-2">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title} className={`px-2 ${item.className || ''}`}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
                tooltip={item.title}
                className="py-2.5"
              >
                {item.openInNewWindow ? (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </a>
                ) : (
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}