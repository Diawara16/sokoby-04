import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface CreationCompleteProps {
  storeUrl?: string;
  productsCount: number;
  onComplete: () => void;
}

export const CreationComplete = ({ storeUrl, productsCount, onComplete }: CreationCompleteProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Félicitations ! 🎉
          </h2>
          <p className="text-gray-600">
            Votre boutique a été créée avec succès avec {productsCount} produits. 
            Vous pouvez maintenant commencer à personnaliser votre boutique et à vendre vos produits.
          </p>
        </div>
        {storeUrl && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Votre boutique est accessible à l'adresse :</p>
            <a 
              href={storeUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline font-medium"
            >
              {storeUrl}
            </a>
          </div>
        )}
        <Button 
          onClick={onComplete}
          className="w-full sm:w-auto"
        >
          Aller au tableau de bord
        </Button>
      </Card>
    </div>
  );
};