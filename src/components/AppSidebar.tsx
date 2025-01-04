import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  Users, 
  Mail,
  Grid,
  Share2,
  BarChart,
  Settings,
  Bell,
  Plug
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: "Tableau de bord", 
    href: "/" 
  },
  { 
    icon: Store, 
    label: "Boutique", 
    href: "/boutique" 
  },
  { 
    icon: Package, 
    label: "Produits", 
    href: "/products" 
  },
  { 
    icon: ShoppingCart, 
    label: "Commandes", 
    href: "/orders" 
  },
  { 
    icon: Users, 
    label: "Clients", 
    href: "/clients" 
  },
  { 
    icon: Mail, 
    label: "Email Marketing", 
    href: "/email-marketing" 
  },
  { 
    icon: Grid, 
    label: "Applications", 
    href: "/applications" 
  },
  { 
    icon: Plug, 
    label: "Intégrations", 
    href: "/integrations" 
  },
  { 
    icon: Share2, 
    label: "Canaux de vente", 
    href: "/vente-multicanale" 
  },
  { 
    icon: BarChart, 
    label: "Analytiques", 
    href: "/analytics" 
  },
  { 
    icon: Settings, 
    label: "Paramètres", 
    href: "/settings" 
  },
  { 
    icon: Bell, 
    label: "Notifications", 
    href: "/notifications" 
  }
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Menu</h2>
            <ScrollArea className="h-[calc(100vh-10rem)] px-2">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={location.pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      location.pathname === item.href && "bg-secondary"
                    )}
                    asChild
                  >
                    <Link to={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}