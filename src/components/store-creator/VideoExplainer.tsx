
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Volume2, VolumeX, Maximize, Captions } from "lucide-react";
import { useState } from "react";

export const VideoExplainer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 font-heading">
          Comment ça marche ?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez en vidéo comment notre IA crée une boutique complète et optimisée en quelques minutes.
        </p>
      </div>

      <Card className="overflow-hidden max-w-4xl mx-auto">
        <div className="relative aspect-video bg-gray-900">
          {/* Video placeholder - replace with actual video */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <div className="text-white space-y-2">
                <h3 className="text-xl font-semibold">Création de boutique IA en action</h3>
                <p className="text-sm opacity-90">Vidéo explicative avec sous-titres français</p>
              </div>
            </div>
          </div>

          {/* Video controls overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <span className="text-white text-sm">0:00 / 3:24</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`text-white hover:bg-white/20 ${showSubtitles ? 'bg-white/20' : ''}`}
                    onClick={() => setShowSubtitles(!showSubtitles)}
                  >
                    <Captions className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-2">
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div className="bg-primary h-1 rounded-full w-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Subtitles overlay */}
          {showSubtitles && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/80 text-white text-center px-4 py-2 rounded max-w-md">
                <p className="text-sm">
                  Notre IA analyse votre niche et génère automatiquement tous les produits nécessaires...
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-semibold">1</span>
              </div>
              <h4 className="font-medium">Choisissez votre niche</h4>
              <p className="text-sm text-gray-600">Sélectionnez parmi nos niches optimisées</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-semibold">2</span>
              </div>
              <h4 className="font-medium">L'IA génère tout</h4>
              <p className="text-sm text-gray-600">Produits, descriptions, design automatique</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-semibold">3</span>
              </div>
              <h4 className="font-medium">Boutique prête</h4>
              <p className="text-sm text-gray-600">Votre boutique est opérationnelle</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
