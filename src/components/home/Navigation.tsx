
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { T } from "@/components/translation/T";
import { MainNavigation } from "@/components/layout/navigation/MainNavigation";
import { Logo } from "@/components/layout/navigation/Logo";

export function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-8">
        <Logo />
        
        <MainNavigation />
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/connexion">
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
