import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Home, ShoppingBag, UserCircle, Settings, Clock, XOctagon } from "lucide-react"

const configMenuItems = [
  {
    title: "Boutique",
    url: "/boutique",
    icon: ShoppingBag,
  },
  {
    title: "Commandes temporaires",
    url: "/commandes-temporaires",
    icon: Clock,
  },
  {
    title: "Paiements annulés",
    url: "/paiements-annules",
    icon: XOctagon,
  },
  {
    title: "Profil",
    url: "/profil",
    icon: UserCircle,
  },
  {
    title: "Paramètres",
    url: "/parametres",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const isHomePage = location.pathname === "/"

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setHasCompletedOnboarding(!isHomePage)
      }
    }

    checkOnboardingStatus()
  }, [isHomePage])

  // Ne pas afficher la barre latérale sur la page d'accueil
  if (isHomePage) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    <span>Accueil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {configMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}