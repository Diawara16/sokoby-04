import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Globe, ChevronRight } from "lucide-react";
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
import { navigationLinks } from "./NavigationLinks";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { currentLanguage, setCurrentLanguage } = useLanguageContext();
  const { isAuthenticated } = useAuthAndProfile();

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    setIsLanguageOpen(false);
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
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <Collapsible
              open={isLanguageOpen}
              onOpenChange={setIsLanguageOpen}
              className="border-t pt-4 mt-4"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Langues
                </div>
                <ChevronRight className={`h-5 w-5 transition-transform ${isLanguageOpen ? 'rotate-90' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
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
              </CollapsibleContent>
            </Collapsible>

            {!isAuthenticated && (
              <div className="border-t pt-4 mt-4">
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Se connecter
                  </Button>
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 block"
                >
                  <Button className="w-full">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};