import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

const Parametres = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Settings className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Préférences générales</h2>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            Les paramètres de votre compte seront bientôt disponibles.
          </p>
          <Button variant="outline">Mettre à jour</Button>
        </div>
      </Card>
    </div>
  );
};

export default Parametres;