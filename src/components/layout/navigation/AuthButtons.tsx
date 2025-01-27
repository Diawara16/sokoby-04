import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
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