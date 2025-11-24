
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bot, Wand2 } from "lucide-react";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { UserMenu } from "@/components/layout/navigation/UserMenu";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthAndProfile();

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Fonctionnalités", href: "/fonctionnalites" },
    { 
      name: "Boutique IA", 
      href: "/boutique-ia",
      icon: <Bot className="h-4 w-4" />,
      highlight: true
    },
    { name: "Tarifs", href: "/tarifs" },
    { name: "À propos", href: "/qui-sommes-nous" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">S</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">Sokoby</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 font-medium transition-colors text-sm xl:text-base ${
                  item.highlight 
                    ? "text-primary hover:text-primary/90" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.name}
                {item.highlight && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">
                    IA
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/connexion">
                  <Button variant="ghost" size="sm" className="text-sm">Se connecter</Button>
                </Link>
                <Link to="/essai-gratuit">
                  <Button className="bg-red-600 hover:bg-red-700 text-sm" size="sm">
                    Essai gratuit
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <nav className="flex flex-col space-y-3 sm:space-y-4 mt-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 font-medium py-2 text-sm sm:text-base ${
                      item.highlight 
                        ? "text-primary hover:text-primary/90" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {item.highlight && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">
                        IA
                      </Badge>
                    )}
                  </Link>
                ))}
                
                {/* Additional AI Store options in mobile */}
                <div className="pt-3 sm:pt-4 border-t">
                  <Link
                    to="/creer-boutique-ia"
                    className="flex items-center gap-3 text-primary hover:text-primary/90 font-semibold py-2 text-sm sm:text-base"
                    onClick={() => setIsOpen(false)}
                  >
                    <Wand2 className="h-4 w-4" />
                    <span>Créer ma boutique IA</span>
                  </Link>
                </div>
                
                <div className="flex flex-col space-y-2 pt-3 sm:pt-4 border-t">
                  {isAuthenticated ? (
                    <>
                      <Link to="/gestion-compte" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-sm">
                          Mon compte
                        </Button>
                      </Link>
                      <Link to="/tableau-de-bord" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-sm">
                          Tableau de bord
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/connexion" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-sm">
                          Se connecter
                        </Button>
                      </Link>
                      <Link to="/essai-gratuit" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-sm">
                          Essai gratuit
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
