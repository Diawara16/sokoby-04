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
import { InfoIcon, Facebook } from "lucide-react";

export default function Index() {
  const { toast } = useToast();

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Sokoby - Configuration Facebook Developer</title>
        <meta name="description" content="Configurez votre application Facebook Developer avec Sokoby" />
      </Helmet>

      <div className="container mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <Facebook className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Préparation de votre icône Facebook</h1>
        </div>

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
                <li>Cliquez sur "Choisir un fichier" ci-dessous</li>
                <li>Sélectionnez votre logo/image</li>
                <li>L'image sera automatiquement redimensionnée à 1024x1024 pixels</li>
                <li>Une nouvelle fenêtre s'ouvrira avec votre image redimensionnée</li>
                <li>Téléchargez cette image et utilisez-la sur Facebook Developer</li>
              </ol>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FacebookIconUploader />
          </CardContent>
        </Card>

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