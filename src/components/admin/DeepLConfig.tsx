
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { Settings, Globe, Zap } from "lucide-react";

export function DeepLConfig() {
  const { isTranslationEnabled, setTranslationEnabled } = useLanguageContext();
  const { toast } = useToast();

  const handleTestTranslation = async () => {
    try {
      // Test de traduction
      const testText = "Bonjour, ceci est un test de traduction.";
      toast({
        title: "Test de traduction",
        description: `Texte de test: "${testText}"`,
      });
    } catch (error) {
      toast({
        title: "Erreur de test",
        description: "La traduction de test a échoué.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration DeepL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Traduction automatique</Label>
              <p className="text-sm text-gray-600">
                Activer la traduction automatique avec DeepL
              </p>
            </div>
            <Switch
              checked={isTranslationEnabled}
              onCheckedChange={setTranslationEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Configuration de la clé API</Label>
            <p className="text-sm text-gray-600">
              La clé API DeepL est maintenant gérée de manière sécurisée côté serveur via les secrets Supabase.
              Contactez un administrateur pour modifier la clé API.
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleTestTranslation}
              disabled={!isTranslationEnabled}
            >
              <Zap className="h-4 w-4 mr-2" />
              Tester la traduction
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Langues supportées
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div>🇫🇷 Français</div>
            <div>🇬🇧 Anglais</div>
            <div>🇪🇸 Espagnol</div>
            <div>🇩🇪 Allemand</div>
            <div>🇮🇹 Italien</div>
            <div>🇵🇹 Portugais</div>
            <div>🇷🇺 Russe</div>
            <div>🇨🇳 Chinois</div>
            <div>🇳🇱 Néerlandais</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
