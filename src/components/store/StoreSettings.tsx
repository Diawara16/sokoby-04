import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContactFields } from "./ContactFields";

interface StoreSettings {
  id: string;
  store_name: string;
  store_email: string | null;
  store_phone: string | null;
  store_address: string | null;
  domain_name: string | null;
  is_custom_domain: boolean;
}

export const StoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadStoreSettings = async () => {
    try {
      console.log("Chargement des paramètres de la boutique...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("Aucun utilisateur connecté");
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour accéder aux paramètres de la boutique",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("Utilisateur connecté:", user.id);
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors du chargement des paramètres:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de la boutique",
          variant: "destructive",
        });
        return;
      }

      console.log("Paramètres chargés:", data);
      if (!data) {
        // Créer des paramètres par défaut si aucun n'existe
        const { data: newSettings, error: createError } = await supabase
          .from('store_settings')
          .insert({
            user_id: user.id,
            store_name: 'Ma boutique',
            store_email: user.email,
            domain_name: null,
            is_custom_domain: false
          })
          .select()
          .single();

        if (createError) {
          console.error("Erreur lors de la création des paramètres:", createError);
          throw createError;
        }

        setSettings(newSettings);
      } else {
        setSettings(data);
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des paramètres de la boutique:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres de la boutique",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoreSettings();
  }, []);

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder les paramètres",
          variant: "destructive",
        });
        return;
      }

      if (!settings) return;

      const { error } = await supabase
        .from('store_settings')
        .upsert({
          ...settings,
          user_id: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les paramètres ont été sauvegardés",
      });
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setSettings(prev => prev ? {...prev, [field]: value} : null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Paramètres de la boutique</h2>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {settings?.domain_name ? 
            `Votre boutique utilise le domaine : ${settings.domain_name}` :
            "Aucun domaine configuré pour votre boutique"
          }
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="store_name">Nom de la boutique</Label>
          <Input
            id="store_name"
            value={settings?.store_name || ''}
            onChange={(e) => handleFieldChange('store_name', e.target.value)}
            placeholder="Ma boutique"
          />
        </div>

        <ContactFields
          storeEmail={settings?.store_email || ''}
          storePhone={settings?.store_phone || ''}
          storeAddress={settings?.store_address || ''}
          onChange={handleFieldChange}
        />

        <Button onClick={handleSave} className="w-full">
          Sauvegarder les modifications
        </Button>
      </div>
    </Card>
  );
};