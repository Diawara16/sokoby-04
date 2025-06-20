
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { languages } from "@/translations";

export const SubtitleLanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguageContext();

  const currentLangName = languages.find(lang => lang.code === currentLanguage)?.name || 'Français';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
          <Globe className="h-4 w-4 mr-2" />
          {currentLangName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <div className="px-2 py-1 text-sm font-medium text-gray-500">
          Langue des sous-titres
        </div>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setCurrentLanguage(lang.code)}
            className={`cursor-pointer ${
              currentLanguage === lang.code ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
