import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Store, Globe } from "lucide-react";

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

        <div>
          <Label htmlFor="domain_name" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Nom de domaine
          </Label>
          <Input
            id="domain_name"
            value={settings.domain_name}
            onChange={(e) => setSettings({ ...settings, domain_name: e.target.value })}
            placeholder="maboutique.com"
          />
          <p className="text-sm text-gray-500 mt-1">
            Entrez votre nom de domaine personnalisé ou utilisez notre sous-domaine gratuit
          </p>
        </div>

        <div>
          <Label htmlFor="store_email">Email de contact</Label>
          <Input
            id="store_email"
            type="email"
            value={settings.store_email}
            onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
            placeholder="contact@maboutique.com"
          />
        </div>

        <div>
          <Label htmlFor="store_phone">Téléphone</Label>
          <Input
            id="store_phone"
            value={settings.store_phone}
            onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
            placeholder="+33 1 23 45 67 89"
          />
        </div>

        <div>
          <Label htmlFor="store_address">Adresse</Label>
          <Input
            id="store_address"
            value={settings.store_address}
            onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
            placeholder="123 rue du Commerce, 75001 Paris"
          />
        </div>

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