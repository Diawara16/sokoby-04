import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const StoreCreationCard = () => {
  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Store className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Créer ma boutique</CardTitle>
        <CardDescription>
          Commencez votre aventure e-commerce en créant votre première boutique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/creer-boutique-manuelle" className="w-full">
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
              <Store className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Création manuelle</div>
                <div className="text-xs text-muted-foreground">Configuration étape par étape</div>
              </div>
            </Button>
          </Link>
          
          <Link to="/creer-boutique-ia" className="w-full">
            <Button className="w-full h-auto p-4 flex flex-col items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Création avec IA</div>
                <div className="text-xs text-primary-foreground/80">Génération automatique</div>
              </div>
            </Button>
          </Link>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Vous pourrez toujours modifier et personnaliser votre boutique après sa création
          </p>
        </div>
      </CardContent>
    </Card>
  );
};