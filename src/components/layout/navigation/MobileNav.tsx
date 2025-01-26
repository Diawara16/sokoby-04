import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Globe, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileNavProps {
  isAuthenticated: boolean;
}

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'zh', name: '中文' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' }
];

export function MobileNav({ isAuthenticated }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setCurrentLanguage } = useLanguageContext();

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            <Link 
              to="/themes" 
              className="text-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Thèmes
            </Link>
            <Link 
              to="/tarifs" 
              className="text-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Tarifs
            </Link>
            <Link 
              to="/ressources" 
              className="text-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Ressources
            </Link>

            <div className="border-t my-4" />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-between w-full p-2 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>Changer de langue</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`cursor-pointer ${
                      currentLanguage === lang.code ? "bg-red-50 text-red-900" : ""
                    }`}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {!isAuthenticated && (
              <>
                <div className="border-t my-4" />
                <Link 
                  to="/connexion"
                  onClick={() => setIsOpen(false)}
                >
                  <Button 
                    variant="outline" 
                    className="w-full font-medium border-black hover:bg-red-50"
                  >
                    S'identifier
                  </Button>
                </Link>
                <Link 
                  to="/essai-gratuit"
                  onClick={() => setIsOpen(false)}
                >
                  <Button 
                    className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium"
                  >
                    Démarrer l'essai gratuit
                  </Button>
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}