import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

const Boutique = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notre Boutique</h1>
        <Button variant="outline">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Panier
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Produits à venir</p>
            <p className="text-gray-600">Notre catalogue sera bientôt disponible</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Boutique;