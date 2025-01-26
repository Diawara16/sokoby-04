import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface MobileNavProps {
  isAuthenticated: boolean;
}

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
];

export function MobileNav({ isAuthenticated }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setCurrentLanguage } = useLanguageContext();

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

            <div className="flex flex-col gap-3">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="ghost"
                  className={`justify-start ${
                    currentLanguage === lang.code ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setCurrentLanguage(lang.code);
                    setIsOpen(false);
                  }}
                >
                  {lang.name}
                </Button>
              ))}
            </div>

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