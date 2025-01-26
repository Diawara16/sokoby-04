import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/contexts/LanguageContext";

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
];

export function LanguageSelector() {
  const { currentLanguage, setCurrentLanguage } = useLanguageContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setCurrentLanguage(lang.code)}
            className={currentLanguage === lang.code ? "bg-gray-100" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}