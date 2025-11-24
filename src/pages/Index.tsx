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

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Facebook className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Préparation de votre icône Facebook</h1>
        </div>

        <Alert className="mb-4 sm:mb-6">
          <InfoIcon className="h-4 w-4 flex-shrink-0" />
          <AlertDescription className="text-sm sm:text-base">
            Pour Facebook Developer, votre icône doit être exactement de 1024x1024 pixels. 
            Utilisez notre outil ci-dessous pour redimensionner automatiquement votre image.
          </AlertDescription>
        </Alert>

        <Card className="w-full mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Générateur d'icône Facebook</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              <p className="mb-2">Suivez ces étapes :</p>
              <ol className="list-decimal ml-4 space-y-1 text-sm sm:text-base">
                <li>Cliquez sur "Choisir un fichier" ci-dessous</li>
                <li>Sélectionnez votre logo/image</li>
                <li>L'image sera automatiquement redimensionnée à 1024x1024 pixels</li>
                <li>Une nouvelle fenêtre s'ouvrira avec votre image redimensionnée</li>
                <li>Téléchargez cette image et utilisez-la sur Facebook Developer</li>
              </ol>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <FacebookIconUploader />
          </CardContent>
        </Card>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-muted rounded-lg">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Configuration du domaine</h2>
          <p className="mb-4 text-sm sm:text-base">
            Pour vérifier la configuration de votre domaine, accédez aux paramètres de votre boutique.
          </p>
          <Link to="/settings">
            <Button variant="default" className="w-full sm:w-auto">
              Accéder aux paramètres de domaine
            </Button>
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
}