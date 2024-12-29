import { Button } from "@/components/ui/button";
import { translations } from "@/translations";
import { Link, useNavigate } from "react-router-dom";
import { Info, Briefcase, Palette, MessageSquare, CreditCard } from "lucide-react";

interface NavigationProps {
  currentLanguage: string;
}

export const Navigation = ({ currentLanguage }: NavigationProps) => {
  const navigate = useNavigate();
  const t = translations[currentLanguage as keyof typeof translations];

  if (!t?.navigation?.home || !t?.navigation?.about || !t?.navigation?.services || 
      !t?.navigation?.themes || !t?.navigation?.pricing || !t?.navigation?.contact || 
      !t?.cta?.button || typeof t.cta.button !== 'string') {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
          {t.navigation.home}
        </Link>
        <Link to="/a-propos" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
          <Info className="h-4 w-4" />
          {t.navigation.about}
        </Link>
        <Link to="/services" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          {t.navigation.services}
        </Link>
        <Link to="/themes" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          {t.navigation.themes}
        </Link>
        <Link to="/plan-tarifaire" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {t.navigation.pricing}
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {t.navigation.contact}
        </Link>
      </nav>
      <Button 
        variant="default" 
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={() => navigate('/essai-gratuit')}
      >
        {t.cta.button}
      </Button>
    </div>
  );
};