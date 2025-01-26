import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
              src="/lovable-uploads/a23d77a2-5fb5-4b8d-b354-605dc6969483.png" 
              alt="Sokoby" 
              className="h-14 w-auto"
              width="140"
              height="56"
            />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated && (
            <>
              <Link to="/login">
                <Button variant="ghost" className="font-medium">
                  S'identifier
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium">
                  Démarrer l'essai gratuit
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}