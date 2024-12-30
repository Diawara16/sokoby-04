import { useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { navigationItems } from "./navigation/NavigationItems"
import { SidebarMenuItemComponent } from "./navigation/SidebarMenuItem"

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent className="py-6">
        <SidebarMenu className="space-y-2">
          {navigationItems.map((item) => (
            <SidebarMenuItemComponent
              key={item.title}
              title={item.title}
              url={item.url}
              icon={item.icon}
              isActive={location.pathname === item.url}
              openInNewWindow={item.openInNewWindow}
              className={item.className}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}