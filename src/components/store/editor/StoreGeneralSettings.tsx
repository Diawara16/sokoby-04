import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Globe, Mail, Phone, MapPin } from "lucide-react";

interface StoreData {
  id: string;
  store_name: string;
  store_description?: string;
  domain_name?: string;
  category?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
  is_custom_domain: boolean;
}

interface Props {
  storeData: StoreData;
  onDataChange: (newData: Partial<StoreData>) => void;
}

export function StoreGeneralSettings({ storeData, onDataChange }: Props) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: "fashion", label: "Mode et vêtements" },
    { value: "electronics", label: "Électronique" },
    { value: "home", label: "Maison et jardin" },
    { value: "beauty", label: "Beauté et cosmétiques" },
    { value: "sports", label: "Sports et loisirs" },
    { value: "books", label: "Livres et médias" },
    { value: "food", label: "Alimentation" },
    { value: "health", label: "Santé et bien-être" },
    { value: "automotive", label: "Automobile" },
    { value: "other", label: "Autre" }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Vous devez être connecté");
      }

      const { error } = await supabase
        .from('store_settings')
        .upsert({
          ...storeData,
          user_id: user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Paramètres sauvegardés",
        description: "Les informations générales ont été mises à jour avec succès",
      });

    } catch (error) {
      console.error('Error saving store settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Informations de base
          </CardTitle>
          <CardDescription>
            Configurez les informations principales de votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_name">Nom de la boutique *</Label>
            <Input
              id="store_name"
              value={storeData.store_name}
              onChange={(e) => onDataChange({ store_name: e.target.value })}
              placeholder="Ma Super Boutique"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_description">Description</Label>
            <Textarea
              id="store_description"
              value={storeData.store_description || ""}
              onChange={(e) => onDataChange({ store_description: e.target.value })}
              placeholder="Décrivez votre boutique..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select 
              value={storeData.category || ""} 
              onValueChange={(value) => onDataChange({ category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain_name">Nom de domaine</Label>
            <div className="flex items-center gap-2">
              <Input
                id="domain_name"
                value={storeData.domain_name || ""}
                onChange={(e) => onDataChange({ domain_name: e.target.value })}
                placeholder="mon-domaine"
              />
              <span className="text-sm text-muted-foreground">.sokoby.com</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coordonnées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Coordonnées
          </CardTitle>
          <CardDescription>
            Informations de contact de votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email de contact
            </Label>
            <Input
              id="store_email"
              type="email"
              value={storeData.store_email || ""}
              onChange={(e) => onDataChange({ store_email: e.target.value })}
              placeholder="contact@maboutique.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Téléphone
            </Label>
            <Input
              id="store_phone"
              type="tel"
              value={storeData.store_phone || ""}
              onChange={(e) => onDataChange({ store_phone: e.target.value })}
              placeholder="+33 1 23 45 67 89"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_address">Adresse</Label>
            <Textarea
              id="store_address"
              value={storeData.store_address || ""}
              onChange={(e) => onDataChange({ store_address: e.target.value })}
              placeholder="123 Rue de la Boutique, 75001 Paris"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="md:col-span-2">
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </Button>
      </div>
    </div>
  );
}