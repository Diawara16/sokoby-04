import { FacebookIconUploader } from "@/components/facebook/FacebookIconUploader";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const { handleError } = useErrorHandler();
  const { toast } = useToast();

  // Exemple de requête avec retry automatique
  const { data, isLoading, isError } = useQuery({
    queryKey: ['initialData'],
    queryFn: async () => {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
      return response.json();
    },
    retry: 3, // Tentatives de retry automatique
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      handleError(error);
      toast({
        title: "Erreur de chargement",
        description: "Nous rencontrons des difficultés pour charger les données. Réessai automatique en cours...",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    try {
      console.log("Page d'index chargée");
    } catch (error) {
      handleError(error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
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
          <h1 className="text-2xl font-bold mb-4">Icône d'application Facebook</h1>
          <ErrorBoundary>
            <FacebookIconUploader />
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