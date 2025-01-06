import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface DisplaySettingsProps {
  displaySettings: {
    date_format: string;
    products_per_page: number;
    show_out_of_stock: boolean;
    show_low_stock_warning: boolean;
    low_stock_threshold: number;
  };
  onChange: (field: string, value: any) => void;
}

export const DisplaySettings = ({ displaySettings, onChange }: DisplaySettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="date_format">Format de date</Label>
        <Input
          id="date_format"
          value={displaySettings.date_format}
          onChange={(e) =>
            onChange('display_settings', { ...displaySettings, date_format: e.target.value })
          }
          placeholder="dd/MM/yyyy"
        />
      </div>

      <div>
        <Label htmlFor="products_per_page">Produits par page</Label>
        <Input
          id="products_per_page"
          type="number"
          value={displaySettings.products_per_page}
          onChange={(e) =>
            onChange('display_settings', {
              ...displaySettings,
              products_per_page: parseInt(e.target.value),
            })
          }
          min={1}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Afficher les produits en rupture</Label>
          <p className="text-sm text-muted-foreground">
            Afficher les produits même quand ils sont en rupture de stock
          </p>
        </div>
        <Switch
          checked={displaySettings.show_out_of_stock}
          onCheckedChange={(checked) =>
            onChange('display_settings', { ...displaySettings, show_out_of_stock: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Alerte stock faible</Label>
          <p className="text-sm text-muted-foreground">
            Afficher une alerte quand le stock est faible
          </p>
        </div>
        <Switch
          checked={displaySettings.show_low_stock_warning}
          onCheckedChange={(checked) =>
            onChange('display_settings', { ...displaySettings, show_low_stock_warning: checked })
          }
        />
      </div>

      <div>
        <Label htmlFor="low_stock_threshold">Seuil de stock faible</Label>
        <Input
          id="low_stock_threshold"
          type="number"
          value={displaySettings.low_stock_threshold}
          onChange={(e) =>
            onChange('display_settings', {
              ...displaySettings,
              low_stock_threshold: parseInt(e.target.value),
            })
          }
          min={0}
        />
      </div>
    </div>
  );
};