import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StoreSettings } from "./types";
import { timezones, currencies, languages } from "./constants";

interface StoreSettingsFormProps {
  settings: StoreSettings;
  onFieldChange: (field: string, value: string) => void;
  onSave: () => void;
}

export const StoreSettingsForm = ({ 
  settings, 
  onFieldChange,
  onSave 
}: StoreSettingsFormProps) => {
  return (
    <div className="space-y-6">
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
        <Label htmlFor="timezone">Fuseau horaire</Label>
        <Select
          value={settings.timezone || 'Europe/Paris'}
          onValueChange={(value) => onFieldChange('timezone', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un fuseau horaire" />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((timezone) => (
              <SelectItem key={timezone.value} value={timezone.value}>
                {timezone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="default_currency">Devise par défaut</Label>
        <Select
          value={settings.default_currency || 'EUR'}
          onValueChange={(value) => onFieldChange('default_currency', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une devise" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="default_language">Langue par défaut</Label>
        <Select
          value={settings.default_language || 'fr'}
          onValueChange={(value) => onFieldChange('default_language', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une langue" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language.value} value={language.value}>
                {language.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onSave} className="w-full">
        Sauvegarder les modifications
      </Button>
    </div>
  );
};