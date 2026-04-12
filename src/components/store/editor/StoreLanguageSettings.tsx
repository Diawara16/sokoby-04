import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "../hooks/useStoreSettings";
import { useAutosave } from "@/hooks/useAutosave";
import { AutosaveIndicator } from "./AutosaveIndicator";

const AVAILABLE_LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
];

interface LangData {
  enabledLanguages: string[];
  defaultLanguage: string;
}

export const StoreLanguageSettings = () => {
  const { settings, setSettings } = useStoreSettings();
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>(['fr']);
  const [defaultLanguage, setDefaultLanguage] = useState('fr');

  // Sync local state when settings load asynchronously
  useEffect(() => {
    if (settings?.enabled_languages) {
      setEnabledLanguages(settings.enabled_languages);
    }
    if (settings?.default_language) {
      setDefaultLanguage(settings.default_language);
    }
  }, [settings?.enabled_languages, settings?.default_language]);

  const saveToDb = useCallback(async (data: LangData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !settings) return false;
    const { error } = await supabase
      .from("store_settings")
      .update({
        enabled_languages: data.enabledLanguages,
        default_language: data.defaultLanguage,
      })
      .eq("user_id", user.id);
    if (!error) {
      setSettings({
        ...settings,
        enabled_languages: data.enabledLanguages,
        default_language: data.defaultLanguage,
      });
    }
    return !error;
  }, [settings, setSettings]);

  const { status, debouncedSave } = useAutosave({ onSave: saveToDb });

  const handleLanguageToggle = (languageCode: string, checked: boolean) => {
    let newEnabled = [...enabledLanguages];
    let newDefault = defaultLanguage;

    if (checked) {
      if (!newEnabled.includes(languageCode)) newEnabled.push(languageCode);
    } else {
      if (newEnabled.length <= 1) {
        toast.error("Vous devez activer au moins une langue");
        return;
      }
      newEnabled = newEnabled.filter(l => l !== languageCode);
      if (languageCode === newDefault && newEnabled.length > 0) {
        newDefault = newEnabled[0];
      }
    }

    setEnabledLanguages(newEnabled);
    setDefaultLanguage(newDefault);
    debouncedSave({ enabledLanguages: newEnabled, defaultLanguage: newDefault });
  };

  const handleDefaultChange = (value: string) => {
    setDefaultLanguage(value);
    debouncedSave({ enabledLanguages, defaultLanguage: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gestion multilingue</CardTitle>
          <AutosaveIndicator status={status} />
        </div>
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
                  onCheckedChange={(checked) => handleLanguageToggle(language.code, checked as boolean)}
                />
                <Label htmlFor={language.code}>{language.name}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="default-language">Langue par défaut</Label>
          <Select value={defaultLanguage} onValueChange={handleDefaultChange}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              {AVAILABLE_LANGUAGES
                .filter(lang => enabledLanguages.includes(lang.code))
                .map((language) => (
                  <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
