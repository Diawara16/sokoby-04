
import { Card } from "@/components/ui/card";
import { VideoPlayer } from "./VideoPlayer";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useDeepLTranslation";

export const VideoExplainer = () => {
  const { currentLanguage } = useLanguageContext();
  
  const sectionTitle = useTranslation("Comment ça marche ?");
  const sectionDescription = useTranslation("Découvrez en vidéo comment notre IA crée une boutique complète et optimisée en quelques minutes.");
  
  const videoTitle = useTranslation("Création de boutique IA en action");
  const videoDescription = useTranslation("Démonstration complète avec sous-titres");

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

      <Card className="overflow-hidden max-w-4xl mx-auto">
        <VideoPlayer 
          title={videoTitle}
          description={videoDescription}
        />

        <div className="p-6 space-y-4">
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
    </div>
  );
};
