import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Link to="/suivi-commande" className="flex items-center gap-2">
        <Button variant="ghost" className="font-medium">
          <Package className="h-4 w-4 mr-2" />
          Suivi de commande
        </Button>
      </Link>
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
  );
}