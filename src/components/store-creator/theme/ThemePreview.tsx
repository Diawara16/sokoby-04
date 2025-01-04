import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeTemplate } from "@/types/theme";
import { Monitor } from "lucide-react";

interface PreviewProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  selectedTemplate: ThemeTemplate | null;
}

export const ThemePreview = ({
  primaryColor,
  secondaryColor,
  accentColor,
  selectedTemplate,
}: PreviewProps) => {
  const PreviewCard = () => (
    <div 
      className="p-4 rounded-lg shadow-lg"
      style={{ backgroundColor: primaryColor }}
    >
      <h3 
        className="text-xl font-bold mb-2"
        style={{ color: accentColor }}
      >
        Aperçu du thème
      </h3>
      <p 
        className="text-sm"
        style={{ color: secondaryColor }}
      >
        Visualisez en direct les changements de votre thème
      </p>
      <Button 
        className="mt-4"
        style={{ 
          backgroundColor: secondaryColor,
          color: primaryColor
        }}
      >
        Bouton exemple
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Aperçu en direct
        </h3>
        <PreviewCard />
      </Card>

      {selectedTemplate && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">{selectedTemplate.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{selectedTemplate.description}</p>
          <div className="flex gap-2">
            {Object.entries(selectedTemplate.colors).map(([name, color]) => (
              <div
                key={name}
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color }}
                title={name}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};