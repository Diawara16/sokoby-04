import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Palette } from "lucide-react";

interface ThemePresetsProps {
  activeTheme: string;
  onThemeChange: (theme: string) => void;
  primaryColor: string;
  secondaryColor: string;
  onColorChange: (field: "primary" | "secondary", value: string) => void;
  onSave: () => void;
  saving: boolean;
}

const presets = [
  {
    id: "minimal-luxury",
    name: "Minimal Luxe",
    preview: "bg-gradient-to-br from-gray-100 to-white",
    accent: "#1a1a1a",
    secondary: "#6b7280",
    desc: "Élégant et épuré",
  },
  {
    id: "bold-sales",
    name: "Bold Sales",
    preview: "bg-gradient-to-br from-red-500 to-orange-400",
    accent: "#dc2626",
    secondary: "#f97316",
    desc: "Conversions maximales",
  },
  {
    id: "soft-pastel",
    name: "Soft Pastel",
    preview: "bg-gradient-to-br from-pink-300 to-purple-300",
    accent: "#ec4899",
    secondary: "#a78bfa",
    desc: "Doux et accueillant",
  },
  {
    id: "dark-premium",
    name: "Dark Premium",
    preview: "bg-gradient-to-br from-gray-900 to-black",
    accent: "#f59e0b",
    secondary: "#374151",
    desc: "Haut de gamme sombre",
  },
];

export function ThemePresets({
  activeTheme,
  onThemeChange,
  primaryColor,
  secondaryColor,
  onColorChange,
  onSave,
  saving,
}: ThemePresetsProps) {
  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4" /> Thèmes prédéfinis
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <Card
              key={preset.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeTheme === preset.id ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onClick={() => {
                onThemeChange(preset.id);
                onColorChange("primary", preset.accent);
                onColorChange("secondary", preset.secondary);
              }}
            >
              <CardContent className="p-3">
                <div className={`h-16 rounded-lg mb-2 ${preset.preview} relative`}>
                  {activeTheme === preset.id && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold">{preset.name}</p>
                <p className="text-[10px] text-muted-foreground">{preset.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Couleur principale</label>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg border shadow-sm" style={{ backgroundColor: primaryColor }} />
            <input
              type="color"
              value={primaryColor}
              className="h-10 w-20 cursor-pointer"
              onChange={(e) => onColorChange("primary", e.target.value)}
            />
            <span className="text-xs text-muted-foreground font-mono">{primaryColor}</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Couleur secondaire</label>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg border shadow-sm" style={{ backgroundColor: secondaryColor }} />
            <input
              type="color"
              value={secondaryColor}
              className="h-10 w-20 cursor-pointer"
              onChange={(e) => onColorChange("secondary", e.target.value)}
            />
            <span className="text-xs text-muted-foreground font-mono">{secondaryColor}</span>
          </div>
        </div>
      </div>

      <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
        {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
      </Button>
    </div>
  );
}
