import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "../hooks/useStoreSettings";

const AVAILABLE_LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
];

export const StoreLanguageSettings = () => {
  const { settings, setSettings } = useStoreSettings();
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>(
    settings?.enabled_languages || ['fr']
  );
  const [defaultLanguage, setDefaultLanguage] = useState(
    settings?.default_language || 'fr'
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLanguageToggle = (languageCode: string, checked: boolean) => {
    let newEnabledLanguages = [...enabledLanguages];
    
    if (checked) {
      if (!newEnabledLanguages.includes(languageCode)) {
        newEnabledLanguages.push(languageCode);
      }
    } else {
      newEnabledLanguages = newEnabledLanguages.filter(lang => lang !== languageCode);
      // Si la langue par défaut est désactivée, la changer
      if (languageCode === defaultLanguage && newEnabledLanguages.length > 0) {
        setDefaultLanguage(newEnabledLanguages[0]);
      }
    }
    
    setEnabledLanguages(newEnabledLanguages);
  };

  const handleSave = async () => {
    if (!settings) return;
    
    if (enabledLanguages.length === 0) {
      toast({
        title: "Erreur",
        description: "Vous devez activer au moins une langue",
        variant: "destructive",
      });
      return;
    }

    if (!enabledLanguages.includes(defaultLanguage)) {
      toast({
        title: "Erreur",
        description: "La langue par défaut doit être activée",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from('store_settings')
        .update({ 
          enabled_languages: enabledLanguages,
          default_language: defaultLanguage
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings({ 
        ...settings, 
        enabled_languages: enabledLanguages,
        default_language: defaultLanguage
      });
      
      toast({
        title: "Succès",
        description: "Paramètres de langue mis à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion multilingue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Langues disponibles</Label>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {AVAILABLE_LANGUAGES.map((language) => (
              <div key={language.code} className="flex items-center space-x-2">
                <Checkbox
                  id={language.code}
                  checked={enabledLanguages.includes(language.code)}
                  onCheckedChange={(checked) => 
                    handleLanguageToggle(language.code, checked as boolean)
                  }
                />
                <Label htmlFor={language.code}>{language.name}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="default-language">Langue par défaut</Label>
          <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_LANGUAGES
                .filter(lang => enabledLanguages.includes(lang.code))
                .map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </CardContent>
    </Card>
  );
};