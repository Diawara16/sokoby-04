import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";

export function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-xl font-bold text-primary-700">
          Sokoby
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/pricing">
            <Button variant="ghost">Tarifs</Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost">À propos</Button>
          </Link>
          <Link to="/index" className="flex items-center space-x-2">
            <Button variant="ghost" className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              <span>Outil Facebook</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/login">
          <Button variant="ghost">Connexion</Button>
        </Link>
        <Link to="/essai-gratuit">
          <Button variant="default">Démarrer gratuitement</Button>
        </Link>
      </div>
    </nav>
  );
}