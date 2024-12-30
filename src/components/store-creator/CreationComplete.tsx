import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CreationCompleteProps {
  storeUrl: string;
  onComplete: () => void;
}

export const CreationComplete = ({ storeUrl, onComplete }: CreationCompleteProps) => {
  return (
    <Card className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Félicitations ! 🎉
      </h2>
      <p className="mb-4">
        Votre boutique a été créée avec succès. Vous pouvez maintenant commencer à personnaliser votre boutique et à vendre vos produits.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Votre boutique est accessible à l'adresse : <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{storeUrl}</a>
      </p>
      <Button onClick={onComplete}>
        Aller au tableau de bord
      </Button>
    </Card>
  );
};