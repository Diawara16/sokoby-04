import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    { to: "/", label: "Accueil" },
    { to: "/plan-tarifaire", label: "Tarifs" },
    { to: "/themes", label: "Thèmes" },
    { to: "/guides", label: "Guides" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white z-50">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/e423a6d8-87e5-4ef9-af43-7e96b44fd685.png" 
              alt="Sokoby" 
              className="h-14 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <NotificationBell />
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/essai-gratuit">
                <Button variant="ghost" className="font-medium">
                  Se connecter
                </Button>
              </Link>
              <Link to="/essai-gratuit">
                <Button className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium">
                  Démarrer l'essai gratuit
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
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
                    className="text-lg text-gray-600 hover:text-gray-900 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="flex flex-col gap-3 mt-4">
                    <Link to="/essai-gratuit">
                      <Button variant="ghost" className="w-full font-medium">
                        Se connecter
                      </Button>
                    </Link>
                    <Link to="/essai-gratuit">
                      <Button className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium">
                        Démarrer l'essai gratuit
                      </Button>
                    </Link>
                  </div>
                )}
                {isAuthenticated && (
                  <div className="mt-4">
                    <NotificationBell />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}