import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CreationCompleteProps {
  onGoToDashboard: () => void;
}

export const CreationComplete = ({ onGoToDashboard }: CreationCompleteProps) => {
  return (
    <Card className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Félicitations ! 🎉
      </h2>
      <p className="mb-6">
        Votre boutique a été créée avec succès. Vous pouvez maintenant commencer à personnaliser votre boutique et à vendre vos produits.
      </p>
      <Button onClick={onGoToDashboard}>
        Aller au tableau de bord
      </Button>
    </Card>
  );
};