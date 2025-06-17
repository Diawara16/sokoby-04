
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Menu, 
  Globe, 
  ChevronRight,
  Settings,
  HelpCircle,
  MessageSquare,
  CreditCard,
  Users,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { languages } from "@/translations";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuItems = [
  { 
    to: "/plan-tarifaire", 
    label: "Tarifs",
    icon: <CreditCard className="h-5 w-5" />
  },
  { 
    to: "/qui-sommes-nous", 
    label: "À propos",
    icon: <Info className="h-5 w-5" />
  },
  { 
    to: "/contact", 
    label: "Contact",
    icon: <MessageSquare className="h-5 w-5" />
  },
  { 
    to: "/faq", 
    label: "Aide",
    icon: <HelpCircle className="h-5 w-5" />
  },
  { 
    to: "/parametres", 
    label: "Paramètres",
    icon: <Settings className="h-5 w-5" />
  }
];

interface MobileNavProps {
  isAuthenticated: boolean;
}

export const MobileNav = ({ isAuthenticated }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { currentLanguage, setCurrentLanguage } = useLanguageContext();

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
        <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 p-3 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="text-base font-medium">{item.label}</span>
              </Link>
            ))}

            <Collapsible
              open={isLanguageOpen}
              onOpenChange={setIsLanguageOpen}
              className="mt-4 border-t pt-4"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5" />
                  <span className="text-base font-medium">Langues</span>
                </div>
                <ChevronRight className={`h-5 w-5 transition-transform ${isLanguageOpen ? 'rotate-90' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 pl-3">
                <div className="grid grid-cols-1 gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={currentLanguage === lang.code ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.name}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {!isAuthenticated && (
              <div className="border-t pt-4 mt-4 space-y-2">
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
                  <Button className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white">
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
