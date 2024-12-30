import { Loader2 } from "lucide-react";

interface CreationProgressProps {
  message: string;
}

export const CreationProgress = ({ message }: CreationProgressProps) => {
  return (
    <div className="text-center py-12">
      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
      <h2 className="text-2xl font-semibold mb-2">
        Création de votre boutique en cours...
      </h2>
      <p className="text-muted-foreground">
        {message}
      </p>
    </div>
  );
};