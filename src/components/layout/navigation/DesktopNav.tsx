import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "./LanguageSelector";

interface DesktopNavProps {
  isAuthenticated: boolean;
}

export function DesktopNav({ isAuthenticated }: DesktopNavProps) {
  return (
    <div className="hidden md:flex items-center gap-4">
      <nav className="flex items-center space-x-6">
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

      <div className="flex items-center gap-4">
        <LanguageSelector />
        
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
    </div>
  );
}