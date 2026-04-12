import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "../hooks/useStoreSettings";
import { useAutosave } from "@/hooks/useAutosave";
import { AutosaveIndicator } from "./AutosaveIndicator";

export const StoreAboutSettings = () => {
  const { settings, setSettings } = useStoreSettings();
  const [aboutText, setAboutText] = useState("");

  // Sync local state when settings load asynchronously
  useEffect(() => {
    if (settings?.about_text != null) {
      setAboutText(settings.about_text);
    }
  }, [settings?.about_text]);

  const saveToDb = useCallback(async (text: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !settings) return false;
    const { error } = await supabase
      .from("store_settings")
      .update({ about_text: text })
      .eq("user_id", user.id);
    if (!error) {
      setSettings({ ...settings, about_text: text });
    }
    return !error;
  }, [settings, setSettings]);

  const { status, debouncedSave } = useAutosave({ onSave: saveToDb });

  const handleChange = (value: string) => {
    setAboutText(value);
    debouncedSave(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>À propos de votre boutique</CardTitle>
          <AutosaveIndicator status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="about-text">Description de la boutique</Label>
          <Textarea
            id="about-text"
            placeholder="Décrivez votre boutique, votre mission, vos valeurs..."
            value={aboutText}
            onChange={(e) => handleChange(e.target.value)}
            rows={6}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};
