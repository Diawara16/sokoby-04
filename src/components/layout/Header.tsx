import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
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

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
];

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setCurrentLanguage } = useLanguageContext();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white z-50">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/a23d77a2-5fb5-4b8d-b354-605dc6969483.png" 
              alt="Sokoby" 
              className="h-14 w-auto"
              width="140"
              height="56"
            />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/themes" className="text-gray-600 hover:text-gray-900">
              Thèmes
            </Link>
            <Link to="/tarifs" className="text-gray-600 hover:text-gray-900">
              Tarifs
            </Link>
            <Link to="/ressources" className="text-gray-600 hover:text-gray-900">
              Ressources
            </Link>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
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

          {!isAuthenticated && (
            <>
              <Link to="/connexion">
                <Button 
                  variant="outline" 
                  className="font-medium border-black hover:bg-red-50"
                >
                  S'identifier
                </Button>
              </Link>
              <Link to="/essai-gratuit">
                <Button 
                  className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium"
                >
                  Démarrer l'essai gratuit
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
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
      </div>
    </header>
  );
}