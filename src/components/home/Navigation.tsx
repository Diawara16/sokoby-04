
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { T } from "@/components/translation/T";

export function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-xl font-bold text-primary-700">
          Sokoby
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/pricing">
            <Button variant="ghost">
              <T>Tarifs</T>
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost">
              <T>À propos</T>
            </Button>
          </Link>
          <Link to="/index" className="flex items-center space-x-2">
            <Button variant="ghost" className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              <T>Outil Facebook</T>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/login">
          <Button variant="ghost">
            <T>Connexion</T>
          </Button>
        </Link>
        <Link to="/essai-gratuit">
          <Button variant="default">
            <T>Démarrer gratuitement</T>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
