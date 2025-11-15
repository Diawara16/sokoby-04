
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreerBoutiqueIA = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthAndProfile();

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour créer votre boutique IA personnalisée.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/register">Créer un compte</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/tableau-de-bord">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Créer votre boutique IA</h1>
        </div>

        {/* New form will be built here */}
        <div className="space-y-8">
          {/* Empty container ready for new Shopify + Stripe flow */}
        </div>
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;
