import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StoreSettings } from "./types";
import { timezones, currencies, languages } from "./constants";
import { ContactFields } from "./ContactFields";
import { BillingFields } from "./BillingFields";
import { GDPRSettings } from "./GDPRSettings";
import { DisplaySettings } from "./DisplaySettings";
import { SocialMediaSettings } from "./SocialMediaSettings";
import { NotificationSettings } from "./NotificationSettings";

interface StoreSettingsFormProps {
  settings: StoreSettings;
  onFieldChange: (field: string, value: any) => void;
  onSave: () => void;
}

export const StoreSettingsForm = ({ 
  settings, 
  onFieldChange,
  onSave 
}: StoreSettingsFormProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
          <TabsTrigger value="gdpr">RGPD</TabsTrigger>
          <TabsTrigger value="display">Affichage</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6 space-y-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <ContactFields
                storeEmail={settings.store_email || ''}
                storePhone={settings.store_phone || ''}
                storeAddress={settings.store_address || ''}
                onChange={onFieldChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardContent className="pt-6">
              <BillingFields
                vatNumber={settings.vat_number || ''}
                vatRate={settings.vat_rate || 20}
                invoicePrefix={settings.invoice_prefix || ''}
                invoiceFooter={settings.invoice_footer_text || ''}
                invoiceLegalNotice={settings.invoice_legal_notice || ''}
                invoiceTemplate={settings.invoice_template || {}}
                onChange={onFieldChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gdpr">
          <Card>
            <CardContent className="pt-6">
              <GDPRSettings
                gdprSettings={settings.gdpr_settings || {
                  cookie_consent_enabled: true,
                  privacy_policy_url: null,
                  cookie_duration_days: 30,
                  data_retention_months: 24
                }}
                onChange={onFieldChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardContent className="pt-6">
              <DisplaySettings
                displaySettings={settings.display_settings || {
                  date_format: "dd/MM/yyyy",
                  products_per_page: 12,
                  show_out_of_stock: true,
                  show_low_stock_warning: true,
                  low_stock_threshold: 5
                }}
                onChange={onFieldChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardContent className="pt-6">
              <SocialMediaSettings
                socialMedia={settings.social_media || {
                  facebook: null,
                  instagram: null,
                  twitter: null,
                  linkedin: null,
                  youtube: null
                }}
                onChange={onFieldChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="pt-6">
              <NotificationSettings
                notificationSettings={settings.notification_settings || {
                  order_updates: true,
                  stock_alerts: true,
                  marketing_emails: true,
                  security_alerts: true,
                  newsletter: false
                }}
                onChange={onFieldChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={onSave} className="w-full">
        Sauvegarder les modifications
      </Button>
    </div>
  );
};