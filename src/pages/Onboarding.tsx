import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, UserCircle, Settings, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/pricing/LoadingSpinner";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeSettings, setStoreSettings] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur lors de la vérification de la session:", sessionError);
          setError("Impossible de vérifier votre session");
          navigate('/');
          return;
        }

        if (!session) {
          console.log("Aucune session trouvée, redirection vers la page d'accueil");
          navigate('/');
          return;
        }

        const { data: existingSettings, error: settingsError } = await supabase
          .from('store_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (settingsError) {
          console.error("Erreur lors de la récupération des paramètres:", settingsError);
          setError("Impossible de charger les paramètres de votre boutique");
          setIsLoading(false);
          return;
        }

        setStoreSettings(existingSettings);
      } catch (error) {
        console.error("Erreur inattendue:", error);
        setError("Une erreur inattendue s'est produite");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  const handleConfigureStore = () => {
    console.log("Navigation vers la configuration de la boutique");
    navigate('/parametres');
  };

  const handleConfigureProfile = () => {
    console.log("Navigation vers la configuration du profil");
    navigate('/profil');
  };

  const handleAdvancedSettings = () => {
    console.log("Navigation vers les paramètres avancés");
    navigate('/parametres');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <LoadingSpinner message="Chargement de votre espace..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur votre espace</h1>
          <p className="text-muted-foreground">
            Commençons à configurer votre boutique en ligne
          </p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <CardTitle>Configurer ma boutique</CardTitle>
              </div>
              <CardDescription>
                Créez votre première boutique en ligne et commencez à vendre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleConfigureStore}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Commencer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                <CardTitle>Configurer mon profil</CardTitle>
              </div>
              <CardDescription>
                Personnalisez votre profil et vos informations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleConfigureProfile}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Commencer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>Paramètres avancés</CardTitle>
              </div>
              <CardDescription>
                Configurez les paramètres de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleAdvancedSettings}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Commencer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;