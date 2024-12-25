import { Button } from "@/components/ui/button";
import { translations } from "@/translations";
import { Link } from "react-router-dom";

interface NavigationProps {
  currentLanguage: string;
}

export const Navigation = ({ currentLanguage }: NavigationProps) => {
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="flex items-center gap-4">
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-gray-700 hover:text-gray-900">
          Accueil
        </Link>
        <Link to="/a-propos" className="text-gray-700 hover:text-gray-900">
          À propos
        </Link>
        <Link to="/services" className="text-gray-700 hover:text-gray-900">
          Services
        </Link>
        <Link to="/themes" className="text-gray-700 hover:text-gray-900">
          Thèmes
        </Link>
        <Link to="/tarifs" className="text-gray-700 hover:text-gray-900">
          Tarifs
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-gray-900">
          Contact
        </Link>
      </nav>
      <Button 
        variant="default" 
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Démarrer l'essai gratuit
      </Button>
    </div>
  );
};