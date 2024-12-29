import { Globe, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSelectorProps {
  t: any;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  languages: Array<{ code: string; name: string; }>;
}

export const LanguageSelector = ({ t, currentLanguage, onLanguageChange, languages }: LanguageSelectorProps) => {
  // Vérification que les traductions nécessaires existent et sont des chaînes
  if (!t?.footer?.changeLanguage || !t?.footer?.acceptedPayments || 
      !t?.footer?.legalNotice || !t?.footer?.accessibility ||
      typeof t.footer.changeLanguage !== 'string' ||
      typeof t.footer.acceptedPayments !== 'string' ||
      typeof t.footer.legalNotice !== 'string' ||
      typeof t.footer.accessibility !== 'string') {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center hover:text-red-400 transition-colors">
            <Globe className="h-4 w-4 mr-2" />
            {t.footer.changeLanguage}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className="cursor-pointer"
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t.footer.acceptedPayments}</h3>
        <div className="flex space-x-2">
          <CreditCard className="h-6 w-6" />
        </div>
      </div>

      <div className="text-sm text-gray-400">
        <Link to="/legal" className="hover:text-red-400 transition-colors">
          {t.footer.legalNotice}
        </Link>
        {" | "}
        <Link to="/accessibility" className="hover:text-red-400 transition-colors">
          {t.footer.accessibility}
        </Link>
      </div>
    </div>
  );
};