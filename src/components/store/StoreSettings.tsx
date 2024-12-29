import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Store } from "lucide-react";
import { DomainChecker } from "./DomainChecker";
import { ContactFields } from "./ContactFields";

export const StoreSettings = () => {
  const [settings, setSettings] = useState({
    store_name: "",
    domain_name: "",
    store_email: "",
    store_phone: "",
    store_address: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStoreSettings();
  }, []);

  const loadStoreSettings = async () => {
    try {
      const { data: storeData, error } = await supabase
        .from("store_settings")
        .select("*")
        .single();

      if (error) throw error;

      if (storeData) {
        setSettings({
          store_name: storeData.store_name || "",
          domain_name: storeData.domain_name || "",
          store_email: storeData.store_email || "",
          store_phone: storeData.store_phone || "",
          store_address: storeData.store_address || "",
        });
      }
    } catch (error) {
      console.error("Error loading store settings:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres de la boutique",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("store_settings")
        .upsert({
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les paramètres de la boutique ont été enregistrés",
      });
    } catch (error) {
      console.error("Error saving store settings:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres de la boutique",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleContactFieldChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Store className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold">Paramètres de la boutique</h3>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="store_name">Nom de la boutique</Label>
          <Input
            id="store_name"
            value={settings.store_name}
            onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
            placeholder="Ma boutique en ligne"
          />
        </div>

        <DomainChecker
          value={settings.domain_name}
          onChange={(value) => setSettings({ ...settings, domain_name: value })}
        />

        <ContactFields
          storeEmail={settings.store_email}
          storePhone={settings.store_phone}
          storeAddress={settings.store_address}
          onChange={handleContactFieldChange}
        />

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </Card>
  );
};