import { Home, ShoppingBag, UserCircle, Settings } from "lucide-react"
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

const configMenuItems = [
  {
    title: "Boutique",
    url: "/boutique",
    icon: ShoppingBag,
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
        // On considère que l'utilisateur a complété l'onboarding s'il n'est pas sur la page d'accueil
        setHasCompletedOnboarding(!isHomePage)
      }
    }

    checkOnboardingStatus()
  }, [isHomePage])

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

              {hasCompletedOnboarding && configMenuItems.map((item) => (
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