
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { deepLService } from "@/services/deepLService";
import { Settings, Globe, Zap, BarChart3, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DeepLConfigAdvanced() {
  const [isTestingTranslation, setIsTestingTranslation] = useState(false);
  const [cacheStats, setCacheStats] = useState({ totalCached: 0, isConfigured: true });
  const { isTranslationEnabled, setTranslationEnabled } = useLanguageContext();
  const { toast } = useToast();

  useEffect(() => {
    const stats = deepLService.getCacheStats();
    setCacheStats(stats);
  }, []);

  const handleTestTranslation = async () => {
    setIsTestingTranslation(true);
    
    try {
      const testTexts = [
        "Bonjour, ceci est un test de traduction.",
        "Créer ma boutique en ligne",
        "Nos plans tarifaires"
      ];
      
      const translations = await Promise.all(
        testTexts.map(text => deepLService.translate(text, 'en'))
      );
      
      toast({
        title: "Test réussi",
        description: `Exemples traduits: ${translations.join(', ')}`,
      });
    } catch (error) {
      toast({
        title: "Erreur de test",
        description: "La traduction de test a échoué. Vérifiez la configuration serveur.",
        variant: "destructive",
      });
    } finally {
      setIsTestingTranslation(false);
    }
  };

  const handleClearCache = () => {
    deepLService.clearCache();
    setCacheStats(deepLService.getCacheStats());
    
    toast({
      title: "Cache vidé",
      description: "Le cache des traductions a été vidé avec succès.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration DeepL Avancée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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
                  disabled={!isTranslationEnabled || isTestingTranslation}
                >
                  {isTestingTranslation ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Tester
                </Button>
              </div>
            </div>

            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  <Badge variant={cacheStats.isConfigured ? "default" : "secondary"}>
                    {cacheStats.isConfigured ? "Configuré" : "Non configuré"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Traductions en cache:</span>
                  <span className="font-medium">{cacheStats.totalCached}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearCache}
                  className="w-full"
                >
                  Vider le cache
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Langues supportées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇫🇷</span>
              <span>Français (source)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇬🇧</span>
              <span>Anglais</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇪🇸</span>
              <span>Espagnol</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇩🇪</span>
              <span>Allemand</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇮🇹</span>
              <span>Italien</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇵🇹</span>
              <span>Portugais</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇷🇺</span>
              <span>Russe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇨🇳</span>
              <span>Chinois</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇳🇱</span>
              <span>Néerlandais</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
