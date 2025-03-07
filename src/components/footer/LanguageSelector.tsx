import { Globe } from "lucide-react";
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
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center hover:text-red-400 transition-colors">
            <Globe className="h-4 w-4 mr-2" />
            {t.footer.changeLanguage}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`cursor-pointer ${currentLanguage === lang.code ? 'bg-red-50 text-red-900' : ''}`}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-sm text-gray-300 space-y-2">
        <Link to="/legal" className="hover:text-red-400 transition-colors block">
          {t.footer.legalNotice}
        </Link>
        <Link to="/accessibility" className="hover:text-red-400 transition-colors block">
          {t.footer.accessibility}
        </Link>
        <Link to="/conditions" className="hover:text-red-400 transition-colors block">
          {t.footer.termsOfUse}
        </Link>
        <Link to="/support" className="hover:text-red-400 transition-colors block">
          {t.footer.support}
        </Link>
      </div>
    </div>
  );
};