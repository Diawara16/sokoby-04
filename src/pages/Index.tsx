import { FacebookIconUploader } from "@/components/facebook/FacebookIconUploader";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  useEffect(() => {
    console.log("Page d'index chargée");
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Icône d'application Facebook</h1>
        <FacebookIconUploader />
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Configuration du domaine</h2>
        <p className="mb-4">Pour vérifier la configuration de votre domaine, accédez aux paramètres de votre boutique.</p>
        <Link to="/settings">
          <Button variant="default">
            Accéder aux paramètres de domaine
          </Button>
        </Link>
      </div>
    </div>
  );
}