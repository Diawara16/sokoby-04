import { NavLink } from "react-router-dom";
import { Store, CreditCard, Users, Globe, DollarSign, UserPlus, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Boutique",
    icon: Store,
    path: "/parametres",
  },
  {
    title: "Facturation",
    icon: CreditCard,
    path: "/parametres/facturation",
  },
  {
    title: "Utilisateurs",
    icon: Users,
    path: "/parametres/utilisateurs",
  },
  {
    title: "Paiements",
    icon: DollarSign,
    path: "/parametres/paiements",
  },
  {
    title: "Clients",
    icon: UserPlus,
    path: "/parametres/clients",
  },
  {
    title: "Géolocalisation",
    icon: MapPin,
    path: "/parametres/geolocalisation",
  },
];

export const SettingsSidebar = () => {
  return (
    <div className="w-64 border-r bg-card p-6">
      <h2 className="text-lg font-semibold mb-6">Paramètres</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )
            }
            end={item.path === "/parametres"}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};