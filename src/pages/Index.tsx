import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { FacebookIconUploader } from "@/components/facebook/FacebookIconUploader";
import { Helmet } from "react-helmet";
import { AdvancedInventoryManagement } from "@/components/inventory/AdvancedInventoryManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Index() {
  const { handleError } = useErrorHandler();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['initialData'],
    queryFn: async () => {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
      return response.json();
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      errorHandler: (error: Error) => {
        handleError(error);
        toast({
          title: "Erreur de chargement",
          description: "Nous rencontrons des difficultés pour charger les données. Réessai automatique en cours...",
          variant: "destructive",
        });
      }
    }
  });

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Sokoby - Votre plateforme e-commerce</title>
        <meta name="description" content="Créez et gérez votre boutique en ligne avec Sokoby. Une solution complète pour développer votre activité e-commerce." />
        <meta name="keywords" content="e-commerce, boutique en ligne, vente en ligne, création site e-commerce" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sokoby.com/" />
        <meta property="og:title" content="Sokoby - Votre plateforme e-commerce" />
        <meta property="og:description" content="Créez et gérez votre boutique en ligne avec Sokoby. Une solution complète pour développer votre activité e-commerce." />
        <meta property="og:image" content="https://sokoby.com/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://sokoby.com/" />
        <meta property="twitter:title" content="Sokoby - Votre plateforme e-commerce" />
        <meta property="twitter:description" content="Créez et gérez votre boutique en ligne avec Sokoby. Une solution complète pour développer votre activité e-commerce." />
        <meta property="twitter:image" content="https://sokoby.com/og-image.png" />
      </Helmet>

      <div className="container mx-auto p-4">
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle>Icône pour Facebook Developer</CardTitle>
            <CardDescription>
              Uploadez votre logo ici pour obtenir une version optimisée pour Facebook Developer.
              L'image sera automatiquement redimensionnée aux dimensions 1024x1024 pixels requises par Facebook.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FacebookIconUploader />
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex items-center justify-center min-h-[200px]">
            <LoadingSpinner size={32} />
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">Une erreur est survenue lors du chargement des données.</p>
          </div>
        )}

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
