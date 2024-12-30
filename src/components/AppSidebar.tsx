import { Link, useLocation } from "react-router-dom"
import { Home, ShoppingCart, Package, Users, ShoppingBag, AppWindow, Settings } from "lucide-react"
import {
  SidebarBase,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Accueil",
    url: "/dashboard",
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
  },
  {
    title: "Applications",
    url: "/applications",
    icon: AppWindow,
  },
  {
    title: "Paramètres",
    url: "/parametres",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <SidebarBase>
      <SidebarContent className="py-4">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
                tooltip={item.title}
              >
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </SidebarBase>
  )
}