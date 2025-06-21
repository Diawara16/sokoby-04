
import { Card } from "@/components/ui/card";
import { VideoPlayer } from "./VideoPlayer";
import { VideoProductionManager } from "./VideoProductionManager";
import { CastingManager } from "./CastingManager";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useDeepLTranslation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Settings, Play, Users } from "lucide-react";

export const VideoExplainer = () => {
  const { currentLanguage } = useLanguageContext();
  
  const sectionTitle = useTranslation("Comment ça marche ?");
  const sectionDescription = useTranslation("Découvrez en vidéo comment notre IA crée une boutique complète et optimisée en quelques minutes.");
  
  const videoTitle = useTranslation("Sokoby vs Création Manuelle - La Révolution IA");
  const videoDescription = useTranslation("Démonstration complète avec présentateur professionnel");

  // URL de la vraie vidéo de démonstration (à remplacer par votre vidéo finale)
  const demoVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const steps = [
    {
      number: "1",
      title: useTranslation("Choisissez votre niche"),
      description: useTranslation("Sélectionnez parmi nos niches optimisées")
    },
    {
      number: "2", 
      title: useTranslation("L'IA génère tout"),
      description: useTranslation("Produits, descriptions, design automatique")
    },
    {
      number: "3",
      title: useTranslation("Boutique prête"),
      description: useTranslation("Votre boutique est opérationnelle")
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 font-heading">
          {sectionTitle}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {sectionDescription}
        </p>
      </div>

      <Tabs defaultValue="video" className="w-full max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            {useTranslation("Vidéo Démo")}
          </TabsTrigger>
          <TabsTrigger value="casting" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {useTranslation("Casting")}
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {useTranslation("Production")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="mt-6">
          <Card className="overflow-hidden">
            <VideoPlayer 
              videoUrl={demoVideoUrl}
              title={videoTitle}
              description={videoDescription}
            />

            <div className="p-6 space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  {useTranslation("Processus de création automatisé")}
                </h3>
                <p className="text-gray-600">
                  {useTranslation("Regardez comment Sokoby révolutionne la création de boutiques en ligne")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {steps.map((step) => (
                  <div key={step.number} className="text-center space-y-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-primary font-semibold">{step.number}</span>
                    </div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="casting" className="mt-6">
          <CastingManager />
        </TabsContent>

        <TabsContent value="production" className="mt-6">
          <VideoProductionManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
