import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, UserCircle, Settings, ArrowLeft, Globe } from "lucide-react";
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
      title: translations[lang].languageChanged?.title || "Langue modifiée",
      description: translations[lang].languageChanged?.description || `La langue a été changée en ${translations[lang].language}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {translations[currentLanguage].common?.back || "Retour"}
          </Button>

          <div className="flex items-center gap-2 bg-secondary/10 p-2 rounded-lg">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground mr-2">
              {translations[currentLanguage].common?.language || "Langue"}:
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(translations).map((lang) => (
                <Button
                  key={lang}
                  variant={currentLanguage === lang ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleLanguageChange(lang)}
                  className="min-w-[40px] transition-colors"
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4">
            {translations[currentLanguage].onboarding?.title || "Configurez votre compte"}
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            {translations[currentLanguage].onboarding?.subtitle || "Choisissez une option pour commencer à configurer votre compte"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary" 
              onClick={() => handleSetup("/boutique")}
            >
              <div className="text-center space-y-4">
                <ShoppingBag className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">
                  {translations[currentLanguage].onboarding?.shop?.title || "Configurer ma boutique"}
                </h3>
                <p className="text-muted-foreground">
                  {translations[currentLanguage].onboarding?.shop?.description || "Créez votre boutique en ligne et commencez à vendre"}
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
                  {translations[currentLanguage].onboarding?.profile?.title || "Configurer mon profil"}
                </h3>
                <p className="text-muted-foreground">
                  {translations[currentLanguage].onboarding?.profile?.description || "Personnalisez votre profil et vos informations"}
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
                  {translations[currentLanguage].onboarding?.settings?.title || "Paramètres avancés"}
                </h3>
                <p className="text-muted-foreground">
                  {translations[currentLanguage].onboarding?.settings?.description || "Configurez les paramètres de votre compte"}
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