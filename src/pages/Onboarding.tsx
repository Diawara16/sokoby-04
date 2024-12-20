import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, UserCircle, Settings, Import, Store, Rocket, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async (path: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour accéder à cette page",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      navigate(path);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Préparez-vous à vendre
            </h1>
            <p className="text-muted-foreground">
              Voici un guide pour démarrer. Vous recevrez ici de nouveaux conseils et informations au fur et à mesure que votre entreprise se développera.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Guide de configuration</h2>
              <p className="text-muted-foreground mb-2">Utilisez ce guide personnalisé pour rendre votre boutique opérationnelle.</p>
              <p className="text-sm text-muted-foreground">0 sur 15 effectué(s)</p>
            </Card>

            <div className="space-y-4">
              <Card className="p-6">
                <button 
                  onClick={() => handleSetup("/boutique")}
                  className="w-full text-left flex items-center justify-between hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Store className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Ajouter des produits</h3>
                      <p className="text-sm text-muted-foreground">Commencez à ajouter des produits à votre catalogue</p>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </button>
              </Card>

              <Card className="p-6">
                <button 
                  onClick={() => handleSetup("/profil")}
                  className="w-full text-left flex items-center justify-between hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <UserCircle className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Configurer votre profil</h3>
                      <p className="text-sm text-muted-foreground">Personnalisez votre profil et vos informations</p>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </button>
              </Card>

              <Card className="p-6">
                <button 
                  onClick={() => handleSetup("/parametres")}
                  className="w-full text-left flex items-center justify-between hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Settings className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Paramètres de la boutique</h3>
                      <p className="text-sm text-muted-foreground">Configurez les paramètres généraux de votre boutique</p>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </button>
              </Card>

              <Card className="p-6">
                <button 
                  className="w-full text-left flex items-center justify-between hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Rocket className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Lancer votre boutique en ligne</h3>
                      <p className="text-sm text-muted-foreground">Préparez le lancement de votre boutique</p>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;