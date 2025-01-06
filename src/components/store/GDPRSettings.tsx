import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface GDPRSettingsProps {
  gdprSettings: {
    cookie_consent_enabled: boolean;
    privacy_policy_url: string | null;
    cookie_duration_days: number;
    data_retention_months: number;
  };
  onChange: (field: string, value: any) => void;
}

export const GDPRSettings = ({ gdprSettings, onChange }: GDPRSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Consentement des cookies</Label>
          <p className="text-sm text-muted-foreground">
            Activer la bannière de consentement des cookies
          </p>
        </div>
        <Switch
          checked={gdprSettings.cookie_consent_enabled}
          onCheckedChange={(checked) =>
            onChange("gdpr_settings.cookie_consent_enabled", checked)
          }
        />
      </div>

      <div>
        <Label htmlFor="privacy_policy">URL de la politique de confidentialité</Label>
        <Input
          id="privacy_policy"
          value={gdprSettings.privacy_policy_url || ""}
          onChange={(e) =>
            onChange("gdpr_settings.privacy_policy_url", e.target.value)
          }
          placeholder="https://example.com/privacy"
        />
      </div>

      <div>
        <Label htmlFor="cookie_duration">Durée de conservation des cookies (jours)</Label>
        <Input
          id="cookie_duration"
          type="number"
          value={gdprSettings.cookie_duration_days}
          onChange={(e) =>
            onChange("gdpr_settings.cookie_duration_days", parseInt(e.target.value))
          }
        />
      </div>

      <div>
        <Label htmlFor="data_retention">Conservation des données (mois)</Label>
        <Input
          id="data_retention"
          type="number"
          value={gdprSettings.data_retention_months}
          onChange={(e) =>
            onChange("gdpr_settings.data_retention_months", parseInt(e.target.value))
          }
        />
      </div>
    </div>
  );
};