import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Link to="/suivi-commande">
        <Button variant="ghost" className="font-medium flex items-center gap-2">
          <Package className="h-4 w-4" />
          Suivi de commande
        </Button>
      </Link>
      <Link to="/login">
        <Button variant="ghost" className="font-medium">
          Se connecter
        </Button>
      </Link>
      <Link to="/register">
        <Button className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium">
          Démarrer l'essai gratuit
        </Button>
      </Link>
    </div>
  );
}