import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  onPrimaryChange: (color: string) => void;
  onSecondaryChange: (color: string) => void;
  onAccentChange: (color: string) => void;
}

export const ColorPicker = ({
  primaryColor,
  secondaryColor,
  accentColor,
  onPrimaryChange,
  onSecondaryChange,
  onAccentChange,
}: ColorPickerProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Palette className="h-5 w-5" />
        Couleurs
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Couleur principale
          </label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => onPrimaryChange(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Couleur secondaire
          </label>
          <input
            type="color"
            value={secondaryColor}
            onChange={(e) => onSecondaryChange(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Couleur d'accent
          </label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => onAccentChange(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
};