import { NavLink } from "react-router-dom";
import { Store, User, Shield, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Boutique",
    icon: Store,
    path: "/parametres",
  },
  {
    title: "Profil",
    icon: User,
    path: "/parametres/utilisateur",
  },
  {
    title: "Sécurité",
    icon: Shield,
    path: "/parametres/securite",
  },
  {
    title: "Facturation",
    icon: CreditCard,
    path: "/parametres/facturation",
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