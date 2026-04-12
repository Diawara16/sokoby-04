import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAutosave } from "@/hooks/useAutosave";
import { AutosaveIndicator } from "./AutosaveIndicator";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

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
  { value: "other", label: "Autre" },
];

export function StoreGeneralSettings({ storeData, onDataChange }: Props) {
  const saveToDb = useCallback(async (data: StoreData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from("store_settings")
      .upsert(
        { ...data, user_id: user.id, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );

    return !error;
  }, []);

  const { status, debouncedSave } = useAutosave({ onSave: saveToDb });

  const handleChange = (patch: Partial<StoreData>) => {
    onDataChange(patch);
    // We need to pass the full updated object. Use a merge approach:
    const merged = { ...storeData, ...patch };
    debouncedSave(merged);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="md:col-span-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Informations générales</h2>
        <AutosaveIndicator status={status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Informations de base</CardTitle>
          <CardDescription>Configurez les informations principales de votre boutique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_name">Nom de la boutique *</Label>
            <Input id="store_name" value={storeData.store_name} onChange={(e) => handleChange({ store_name: e.target.value })} placeholder="Ma Super Boutique" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store_description">Description</Label>
            <Textarea id="store_description" value={storeData.store_description || ""} onChange={(e) => handleChange({ store_description: e.target.value })} placeholder="Décrivez votre boutique..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={storeData.category || ""} onValueChange={(value) => handleChange({ category: value })}>
              <SelectTrigger><SelectValue placeholder="Sélectionnez une catégorie" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain_name">Nom de domaine</Label>
            <div className="flex items-center gap-2">
              <Input id="domain_name" value={storeData.domain_name || ""} onChange={(e) => handleChange({ domain_name: e.target.value })} placeholder="mon-domaine" />
              <span className="text-sm text-muted-foreground">.sokoby.com</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Coordonnées</CardTitle>
          <CardDescription>Informations de contact de votre boutique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_email" className="flex items-center gap-2"><Mail className="h-4 w-4" />Email de contact</Label>
            <Input id="store_email" type="email" value={storeData.store_email || ""} onChange={(e) => handleChange({ store_email: e.target.value })} placeholder="contact@maboutique.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store_phone" className="flex items-center gap-2"><Phone className="h-4 w-4" />Téléphone</Label>
            <Input id="store_phone" type="tel" value={storeData.store_phone || ""} onChange={(e) => handleChange({ store_phone: e.target.value })} placeholder="+33 1 23 45 67 89" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store_address">Adresse</Label>
            <Textarea id="store_address" value={storeData.store_address || ""} onChange={(e) => handleChange({ store_address: e.target.value })} placeholder="123 Rue de la Boutique, 75001 Paris" rows={3} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
