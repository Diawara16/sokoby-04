import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, UserCircle, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async (path: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");
      
      navigate(path);
      toast({
        title: "Configuration terminée",
        description: "Votre compte a été configuré avec succès",
      });
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
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Configurez votre compte
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Choisissez une option pour commencer à configurer votre compte
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSetup("/boutique")}>
          <div className="text-center space-y-4">
            <ShoppingBag className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Configurer ma boutique</h3>
            <p className="text-gray-600">
              Créez votre boutique en ligne et commencez à vendre
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSetup("/profil")}>
          <div className="text-center space-y-4">
            <UserCircle className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Configurer mon profil</h3>
            <p className="text-gray-600">
              Personnalisez votre profil et vos informations
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSetup("/parametres")}>
          <div className="text-center space-y-4">
            <Settings className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Paramètres avancés</h3>
            <p className="text-gray-600">
              Configurez les paramètres de votre compte
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;