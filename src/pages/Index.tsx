import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { FacebookIconUploader } from "@/components/facebook/FacebookIconUploader";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function Index() {
  const { toast } = useToast();

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Sokoby - Configuration Facebook Developer</title>
        <meta name="description" content="Configurez votre application Facebook Developer avec Sokoby" />
      </Helmet>

      <div className="container mx-auto p-4">
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Pour Facebook Developer, votre icône doit être exactement de 1024x1024 pixels. 
            Utilisez notre outil ci-dessous pour redimensionner automatiquement votre image.
          </AlertDescription>
        </Alert>

        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle>Générateur d'icône Facebook</CardTitle>
            <CardDescription>
              <p>Suivez ces étapes :</p>
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>Sélectionnez votre logo/image ci-dessous</li>
                <li>L'image sera automatiquement redimensionnée à 1024x1024 pixels</li>
                <li>Téléchargez le résultat et utilisez-le sur Facebook Developer</li>
              </ol>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FacebookIconUploader />
          </CardContent>
        </Card>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Gestion de votre boutique</h1>
          <ErrorBoundary>
            <AdvancedInventoryManagement />
          </ErrorBoundary>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Configuration du domaine</h2>
          <p className="mb-4">
            Pour vérifier la configuration de votre domaine, accédez aux paramètres de votre boutique.
          </p>
          <Link to="/settings">
            <Button variant="default">
              Accéder aux paramètres de domaine
            </Button>
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
}
