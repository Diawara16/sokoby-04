import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white z-50">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/e423a6d8-87e5-4ef9-af43-7e96b44fd685.png" 
              alt="Sokoby" 
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/plan-tarifaire" className="text-gray-600 hover:text-gray-900">
              Tarifs
            </Link>
            <Link to="/guides" className="text-gray-600 hover:text-gray-900">
              Guides
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Link to="/tableau-de-bord">
                <Button variant="ghost">Tableau de bord</Button>
              </Link>
              <Link to="/profil">
                <Button variant="outline">Mon profil</Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/plan-tarifaire">
                <Button variant="ghost">Se connecter</Button>
              </Link>
              <Link to="/plan-tarifaire">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Commencer
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}