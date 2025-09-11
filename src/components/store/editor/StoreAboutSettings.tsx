import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "../hooks/useStoreSettings";

export const StoreAboutSettings = () => {
  const { settings, setSettings } = useStoreSettings();
  const [aboutText, setAboutText] = useState(settings?.about_text || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!settings) return;
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from('store_settings')
        .update({ about_text: aboutText })
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings({ ...settings, about_text: aboutText });
      toast({
        title: "Succès",
        description: "Description de la boutique mise à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la description",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>À propos de votre boutique</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="about-text">Description de la boutique</Label>
          <Textarea
            id="about-text"
            placeholder="Décrivez votre boutique, votre mission, vos valeurs..."
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            rows={6}
            className="mt-2"
          />
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </CardContent>
    </Card>
  );
};