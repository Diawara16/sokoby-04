import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CreationCompleteProps {
  storeUrl?: string;
  productsCount: number;
  onComplete: () => void;
}

export const CreationComplete = ({ storeUrl, productsCount, onComplete }: CreationCompleteProps) => {
  return (
    <Card className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Félicitations ! 🎉
      </h2>
      <p className="mb-4">
        Votre boutique a été créée avec succès avec {productsCount} produits. Vous pouvez maintenant commencer à personnaliser votre boutique et à vendre vos produits.
      </p>
      {storeUrl && (
        <p className="text-sm text-muted-foreground mb-6">
          Votre boutique est accessible à l'adresse : <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{storeUrl}</a>
        </p>
      )}
      <Button onClick={onComplete}>
        Aller au tableau de bord
      </Button>
    </Card>
  );
};