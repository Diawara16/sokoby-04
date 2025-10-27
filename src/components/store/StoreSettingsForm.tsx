import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StoreSettings } from "./types";

interface StoreSettingsFormProps {
  settings: StoreSettings;
  onFieldChange: (field: string, value: string) => void;
  onSave: () => void;
}

export const StoreSettingsForm = ({ settings, onFieldChange, onSave }: StoreSettingsFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="store_name">Nom de la boutique</Label>
          <Input
            id="store_name"
            value={settings.store_name}
            onChange={(e) => onFieldChange('store_name', e.target.value)}
            placeholder="Ma boutique"
          />
        </div>

        <div>
          <Label htmlFor="store_email">Email de contact</Label>
          <Input
            id="store_email"
            type="email"
            value={settings.store_email || ''}
            onChange={(e) => onFieldChange('store_email', e.target.value)}
            placeholder="contact@maboutique.com"
          />
        </div>

        <div>
          <Label htmlFor="store_phone">Téléphone</Label>
          <Input
            id="store_phone"
            value={settings.store_phone || ''}
            onChange={(e) => onFieldChange('store_phone', e.target.value)}
            placeholder="+33 1 23 45 67 89"
          />
        </div>

        <div>
          <Label htmlFor="store_address">Adresse</Label>
          <Input
            id="store_address"
            value={settings.store_address || ''}
            onChange={(e) => onFieldChange('store_address', e.target.value)}
            placeholder="123 rue du Commerce, 75001 Paris"
          />
        </div>

        <div>
          <Label htmlFor="about_text">À propos</Label>
          <Textarea
            id="about_text"
            value={settings.about_text || ''}
            onChange={(e) => onFieldChange('about_text', e.target.value)}
            placeholder="Décrivez votre boutique..."
            rows={4}
          />
        </div>
      </div>

      <Button onClick={onSave} className="w-full">
        Enregistrer les modifications
      </Button>
    </div>
  );
};
