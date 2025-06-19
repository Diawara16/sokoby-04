
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { Settings, Globe, Zap } from "lucide-react";

export function DeepLConfig() {
  const [apiKey, setApiKey] = useState('');
  const { isTranslationEnabled, setTranslationEnabled } = useLanguageContext();
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    // En production, ceci devrait être sauvegardé dans Supabase secrets
    localStorage.setItem('deepl_api_key', apiKey);
    toast({
      title: "Clé API sauvegardée",
      description: "La clé DeepL a été configurée avec succès.",
    });
  };

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
            <Label htmlFor="api-key">Clé API DeepL</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Entrez votre clé API DeepL"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Obtenez votre clé API gratuite sur{' '}
              <a 
                href="https://www.deepl.com/pro-api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                deepl.com/pro-api
              </a>
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
              <Settings className="h-4 w-4 mr-2" />
              Sauvegarder la clé
            </Button>
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
