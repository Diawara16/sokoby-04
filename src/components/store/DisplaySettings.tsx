import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <Select
          value={displaySettings.date_format}
          onValueChange={(value) => onChange("display_settings.date_format", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dd/MM/yyyy">31/12/2024</SelectItem>
            <SelectItem value="MM/dd/yyyy">12/31/2024</SelectItem>
            <SelectItem value="yyyy-MM-dd">2024-12-31</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="products_per_page">Produits par page</Label>
        <Input
          id="products_per_page"
          type="number"
          value={displaySettings.products_per_page}
          onChange={(e) =>
            onChange("display_settings.products_per_page", parseInt(e.target.value))
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Afficher les produits en rupture</Label>
          <p className="text-sm text-muted-foreground">
            Afficher les produits même s'ils ne sont plus en stock
          </p>
        </div>
        <Switch
          checked={displaySettings.show_out_of_stock}
          onCheckedChange={(checked) =>
            onChange("display_settings.show_out_of_stock", checked)
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
            onChange("display_settings.show_low_stock_warning", checked)
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
            onChange("display_settings.low_stock_threshold", parseInt(e.target.value))
          }
        />
      </div>
    </div>
  );
};