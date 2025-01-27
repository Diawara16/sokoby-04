import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { languages } from "@/translations";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setCurrentLanguage } = useLanguageContext();
  const { isAuthenticated } = useAuthAndProfile();

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
              className="text-lg font-medium hover:text-red-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Thèmes
            </Link>
            <Link 
              to="/tarifs" 
              className="text-lg font-medium hover:text-red-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Tarifs
            </Link>
            <Link 
              to="/ressources" 
              className="text-lg font-medium hover:text-red-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Ressources
            </Link>

            <div className="border-t my-4" />

            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={currentLanguage === lang.code ? "default" : "outline"}
                  className="w-full justify-center"
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </Button>
              ))}
            </div>

            {!isAuthenticated && (
              <>
                <div className="border-t my-4" />
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/connexion"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      Se connecter
                    </Button>
                  </Link>
                  <Link 
                    to="/inscription"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full">
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};