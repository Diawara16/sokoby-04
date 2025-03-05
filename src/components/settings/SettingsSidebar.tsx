
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Store,
  Users, 
  CreditCard, 
  Globe, 
  MapPin, 
  Shield,
  Truck,
  Palette,
  Bell
} from "lucide-react";

export const SettingsSidebar = () => {
  const location = useLocation();

  const settingsLinks = [
    {
      label: "Général",
      href: "/parametres",
      icon: Store,
    },
    {
      label: "Nom de domaine",
      href: "/parametres/domaine",
      icon: Globe,
    },
    {
      label: "DNS",
      href: "/parametres/dns",
      icon: Globe,
    },
    {
      label: "Utilisateurs",
      href: "/parametres/utilisateurs",
      icon: Users,
    },
    {
      label: "Paiements",
      href: "/parametres/paiements",
      icon: CreditCard,
    },
    {
      label: "Expédition",
      href: "/parametres/expedition",
      icon: Truck,
    },
    {
      label: "Géolocalisation",
      href: "/parametres/geolocalisation",
      icon: MapPin,
    },
    {
      label: "Sécurité",
      href: "/parametres/securite",
      icon: Shield,
    },
    {
      label: "Apparence",
      href: "/parametres/apparence",
      icon: Palette,
    },
    {
      label: "Notifications",
      href: "/parametres/notifications",
      icon: Bell,
    }
  ];

  return (
    <div className="w-64 border-r min-h-screen p-4 space-y-2">
      <h2 className="font-semibold mb-4 text-lg px-2 flex items-center gap-2">
        <Settings className="h-5 w-5" />
        Paramètres
      </h2>
      {settingsLinks.map((link) => (
        <Button
          key={link.href}
          variant={location.pathname === link.href ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link to={link.href}>
            <link.icon className="mr-2 h-4 w-4" />
            {link.label}
          </Link>
        </Button>
      ))}
    </div>
  );
};
