import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";
import { StoreCreationButtons } from "@/components/store-creation/StoreCreationButtons";

export const StoreCreationCard = () => {
  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Store className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Créer ma boutique</CardTitle>
        <CardDescription>
          Choisissez entre une création manuelle gratuite ou une génération automatique par IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <StoreCreationButtons variant="card" />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Vous pourrez toujours modifier et personnaliser votre boutique après sa création
          </p>
        </div>
      </CardContent>
    </Card>
  );
};