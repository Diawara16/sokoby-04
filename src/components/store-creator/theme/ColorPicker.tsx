import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleColorChange = (
    color: string, 
    type: 'primary' | 'secondary' | 'accent',
    handler: (color: string) => void
  ) => {
    try {
      handler(color);
    } catch (error) {
      console.error(`Error changing ${type} color:`, error);
      toast({
        title: "Erreur",
        description: `Impossible de changer la couleur ${type}`,
        variant: "destructive",
      });
    }
  };

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
            onChange={(e) => handleColorChange(e.target.value, 'primary', onPrimaryChange)}
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
            onChange={(e) => handleColorChange(e.target.value, 'secondary', onSecondaryChange)}
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
            onChange={(e) => handleColorChange(e.target.value, 'accent', onAccentChange)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
};