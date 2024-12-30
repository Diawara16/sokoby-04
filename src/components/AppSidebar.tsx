import { Link, useLocation } from "react-router-dom"
import { Home, ShoppingCart, Package, Users, ShoppingBag, AppWindow, Settings } from "lucide-react"
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
    title: "Paramètres",
    url: "/parametres",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent className="py-4">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
                tooltip={item.title}
              >
                {item.openInNewWindow ? (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                ) : (
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
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
