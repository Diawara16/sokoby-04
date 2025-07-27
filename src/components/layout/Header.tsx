
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
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Sokoby</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 font-medium transition-colors ${
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
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/connexion">
                  <Button variant="ghost">Se connecter</Button>
                </Link>
                <Link to="/essai-gratuit">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Essai gratuit
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 font-medium py-2 ${
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
                <div className="pt-4 border-t">
                  <Link
                    to="/creer-boutique-ia"
                    className="flex items-center gap-3 text-primary hover:text-primary/90 font-semibold py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Wand2 className="h-4 w-4" />
                    <span>Créer ma boutique IA</span>
                  </Link>
                </div>
                
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  {isAuthenticated ? (
                    <>
                      <Link to="/gestion-compte" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Mon compte
                        </Button>
                      </Link>
                      <Link to="/tableau-de-bord" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-red-600 hover:bg-red-700">
                          Tableau de bord
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/connexion" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Se connecter
                        </Button>
                      </Link>
                      <Link to="/essai-gratuit" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-red-600 hover:bg-red-700">
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
