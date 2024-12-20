import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, UserCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { translations } from "@/translations";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("fr");

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
          <h1 className="text-3xl font-bold text-center mb-4">
            Configurez votre compte
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            Choisissez une option pour commencer à configurer votre compte
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary" 
              onClick={() => handleSetup("/boutique")}
            >
              <div className="text-center space-y-4">
                <ShoppingBag className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">
                  Configurer ma boutique
                </h3>
                <p className="text-muted-foreground">
                  Créez votre boutique en ligne et commencez à vendre
                </p>
              </div>
            </Card>

            <Card 
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary" 
              onClick={() => handleSetup("/profil")}
            >
              <div className="text-center space-y-4">
                <UserCircle className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">
                  Configurer mon profil
                </h3>
                <p className="text-muted-foreground">
                  Personnalisez votre profil et vos informations
                </p>
              </div>
            </Card>

            <Card 
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary" 
              onClick={() => handleSetup("/parametres")}
            >
              <div className="text-center space-y-4">
                <Settings className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">
                  Paramètres avancés
                </h3>
                <p className="text-muted-foreground">
                  Configurez les paramètres de votre compte
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;