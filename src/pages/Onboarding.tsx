import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, UserCircle, Settings, ArrowLeft, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    toast({
      title: "Langue modifiée",
      description: `La langue a été changée en ${translations[lang].language || lang}`,
    });
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        <div className="flex items-center gap-4">
          <Globe className="h-5 w-5 text-gray-500" />
          <div className="flex gap-2">
            {Object.keys(translations).map((lang) => (
              <Button
                key={lang}
                variant={currentLanguage === lang ? "default" : "ghost"}
                size="sm"
                onClick={() => handleLanguageChange(lang)}
              >
                {lang.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">
        {translations[currentLanguage].onboarding?.title || "Configurez votre compte"}
      </h1>
      <p className="text-center text-gray-600 mb-12">
        {translations[currentLanguage].onboarding?.subtitle || "Choisissez une option pour commencer à configurer votre compte"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSetup("/boutique")}>
          <div className="text-center space-y-4">
            <ShoppingBag className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">
              {translations[currentLanguage].onboarding?.shop?.title || "Configurer ma boutique"}
            </h3>
            <p className="text-gray-600">
              {translations[currentLanguage].onboarding?.shop?.description || "Créez votre boutique en ligne et commencez à vendre"}
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSetup("/profil")}>
          <div className="text-center space-y-4">
            <UserCircle className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">
              {translations[currentLanguage].onboarding?.profile?.title || "Configurer mon profil"}
            </h3>
            <p className="text-gray-600">
              {translations[currentLanguage].onboarding?.profile?.description || "Personnalisez votre profil et vos informations"}
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSetup("/parametres")}>
          <div className="text-center space-y-4">
            <Settings className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">
              {translations[currentLanguage].onboarding?.settings?.title || "Paramètres avancés"}
            </h3>
            <p className="text-gray-600">
              {translations[currentLanguage].onboarding?.settings?.description || "Configurez les paramètres de votre compte"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;