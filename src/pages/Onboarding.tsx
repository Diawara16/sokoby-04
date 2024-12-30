import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, UserCircle, Settings, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

        // Récupérer les paramètres de la boutique
        const { data: settings, error: settingsError } = await supabase
          .from('store_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          console.error("Erreur lors de la récupération des paramètres:", settingsError);
          setError("Impossible de charger les paramètres de votre boutique");
        } else {
          setStoreSettings(settings);
        }

        console.log("Session utilisateur valide:", session.user.id);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur inattendue:", error);
        setError("Une erreur inattendue s'est produite");
        navigate('/');
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Changement d'état d'authentification:", event, session?.user?.id);
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const options = [
    {
      title: "Configurer ma boutique",
      description: "Créez votre première boutique en ligne et commencez à vendre",
      icon: ShoppingBag,
      path: "/boutique",
    },
    {
      title: "Configurer mon profil",
      description: "Personnalisez votre profil et vos informations",
      icon: UserCircle,
      path: "/profil",
    },
    {
      title: "Paramètres avancés",
      description: "Configurez les paramètres de votre compte",
      icon: Settings,
      path: "/parametres",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-lg text-gray-600">Chargement de votre espace...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur votre espace</h1>
          <p className="text-muted-foreground mb-6">
            Commençons à configurer votre boutique en ligne
          </p>
        </div>

        <div className="grid gap-6">
          {options.map((option) => (
            <Card 
              key={option.title} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(option.path)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <option.icon className="h-5 w-5" />
                  <span>{option.title}</span>
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Commencer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;