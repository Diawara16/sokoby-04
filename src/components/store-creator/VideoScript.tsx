
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Video } from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface ScriptSegment {
  timestamp: string;
  speaker: 'presenter' | 'voiceover';
  text: string;
  visual: string;
  duration: number;
}

export const VideoScript = () => {
  const titleText = useTranslation("Script Vidéo - Sokoby vs Création Manuelle");
  
  const scriptSegments: ScriptSegment[] = [
    {
      timestamp: "0:00-0:15",
      speaker: "presenter",
      text: useTranslation("Bonjour ! Je suis [Nom] et aujourd'hui je vais vous montrer la différence révolutionnaire entre créer une boutique manuellement et utiliser l'IA de Sokoby."),
      visual: useTranslation("Présentateur face caméra, logo Sokoby en arrière-plan"),
      duration: 15
    },
    {
      timestamp: "0:15-0:45",
      speaker: "presenter", 
      text: useTranslation("D'un côté, la méthode traditionnelle : des heures à chercher des produits, créer des descriptions, configurer le design... De l'autre, Sokoby qui fait tout automatiquement."),
      visual: useTranslation("Split-screen : interface Shopify vs interface Sokoby"),
      duration: 30
    },
    {
      timestamp: "0:45-1:30",
      speaker: "presenter",
      text: useTranslation("Regardez : avec Sokoby, je choisis simplement ma niche 'Sport et Fitness' et notre IA génère instantanément 50+ produits optimisés avec descriptions SEO et images."),
      visual: useTranslation("Demo en direct : sélection niche + génération automatique"),
      duration: 45
    },
    {
      timestamp: "1:30-2:15", 
      speaker: "presenter",
      text: useTranslation("Pendant ce temps, manuellement il faudrait : rechercher chaque produit, négocier avec les fournisseurs, créer chaque fiche produit, optimiser le SEO..."),
      visual: useTranslation("Montage accéléré : création manuelle laborieuse"),
      duration: 45
    },
    {
      timestamp: "2:15-3:00",
      speaker: "presenter",
      text: useTranslation("Résultat : avec Sokoby, ma boutique est prête en 5 minutes. Manuellement ? Comptez plusieurs semaines ! Et le design est automatiquement optimisé pour la conversion."),
      visual: useTranslation("Comparaison finale : boutiques terminées côte à côte"),
      duration: 45
    },
    {
      timestamp: "3:00-3:30",
      speaker: "presenter", 
      text: useTranslation("Notre IA intègre même les fournisseurs automatiquement et configure le SEO. Vous n'avez plus qu'à vendre ! Créez votre boutique Sokoby maintenant."),
      visual: useTranslation("CTA avec bouton 'Créer ma boutique IA' + URL"),
      duration: 30
    }
  ];

  const totalDuration = scriptSegments.reduce((sum, segment) => sum + segment.duration, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="h-6 w-6 text-primary" />
              <CardTitle>{titleText}</CardTitle>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {scriptSegments.map((segment, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="font-mono text-xs">
                    {segment.timestamp}
                  </Badge>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium capitalize">
                      {useTranslation(segment.speaker === 'presenter' ? 'Présentateur' : 'Voix off')}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {useTranslation("Texte")}
                      </h4>
                      <p className="text-sm leading-relaxed">{segment.text}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {useTranslation("Visuel")}
                      </h4>
                      <p className="text-sm text-muted-foreground italic">{segment.visual}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs text-muted-foreground">
                    {segment.duration}s
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-primary">
              {useTranslation("Notes de production")}
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1 text-left max-w-2xl mx-auto">
              <li>• {useTranslation("Prévoir un prompteur pour fluidité du discours")}</li>
              <li>• {useTranslation("Capturer en 4K pour qualité maximale")}</li>
              <li>• {useTranslation("Synchroniser parfaitement audio et démonstrations écran")}</li>
              <li>• {useTranslation("Ajouter sous-titres en français puis traduction auto DeepL")}</li>
              <li>• {useTranslation("CTA cliquable en fin de vidéo vers page création boutique")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
