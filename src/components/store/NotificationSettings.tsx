import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  notificationSettings: {
    order_updates: boolean;
    stock_alerts: boolean;
    marketing_emails: boolean;
    security_alerts: boolean;
    newsletter: boolean;
  };
  onChange: (field: string, value: boolean) => void;
}

export const NotificationSettings = ({ notificationSettings, onChange }: NotificationSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Mises à jour des commandes</Label>
          <p className="text-sm text-muted-foreground">
            Recevoir des notifications sur l'état de vos commandes
          </p>
        </div>
        <Switch
          checked={notificationSettings.order_updates}
          onCheckedChange={(checked) =>
            onChange("notification_settings.order_updates", checked)
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Alertes de stock</Label>
          <p className="text-sm text-muted-foreground">
            Être notifié quand un produit est presque en rupture
          </p>
        </div>
        <Switch
          checked={notificationSettings.stock_alerts}
          onCheckedChange={(checked) =>
            onChange("notification_settings.stock_alerts", checked)
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Emails marketing</Label>
          <p className="text-sm text-muted-foreground">
            Recevoir des offres et promotions par email
          </p>
        </div>
        <Switch
          checked={notificationSettings.marketing_emails}
          onCheckedChange={(checked) =>
            onChange("notification_settings.marketing_emails", checked)
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Alertes de sécurité</Label>
          <p className="text-sm text-muted-foreground">
            Être notifié des activités suspectes
          </p>
        </div>
        <Switch
          checked={notificationSettings.security_alerts}
          onCheckedChange={(checked) =>
            onChange("notification_settings.security_alerts", checked)
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Newsletter</Label>
          <p className="text-sm text-muted-foreground">
            Recevoir notre newsletter mensuelle
          </p>
        </div>
        <Switch
          checked={notificationSettings.newsletter}
          onCheckedChange={(checked) =>
            onChange("notification_settings.newsletter", checked)
          }
        />
      </div>
    </div>
  );
};