import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Users, 
  CreditCard, 
  Globe, 
  MapPin, 
  Shield 
} from "lucide-react";

export const SettingsSidebar = () => {
  const location = useLocation();

  const settingsLinks = [
    {
      label: "Général",
      href: "/parametres",
      icon: Settings,
    },
    {
      label: "Nom de domaine",
      href: "/parametres/domaine",
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
      label: "Géolocalisation",
      href: "/parametres/geolocalisation",
      icon: MapPin,
    },
    {
      label: "Sécurité",
      href: "/parametres/securite",
      icon: Shield,
    },
  ];

  return (
    <div className="w-64 border-r min-h-screen p-4 space-y-2">
      <h2 className="font-semibold mb-4 text-lg px-2">Paramètres</h2>
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