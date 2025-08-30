import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Theme } from "@/types/theme";
import { Monitor } from "lucide-react";

interface PreviewProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  selectedTemplate: Theme | null;
}

export const ThemePreview = ({
  primaryColor,
  secondaryColor,
  accentColor,
  selectedTemplate,
}: PreviewProps) => {
  const PreviewCard = () => (
    <div className="space-y-4">
      {/* Header Preview */}
      <div 
        className="p-4 rounded-lg shadow-lg"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-xl font-bold"
            style={{ color: accentColor }}
          >
            Ma Boutique
          </h3>
          <div className="flex gap-2">
            <div 
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: accentColor, opacity: 0.3 }}
            />
            <div 
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: secondaryColor, opacity: 0.3 }}
            />
          </div>
        </div>
        <p 
          className="text-sm mb-4"
          style={{ color: secondaryColor, opacity: 0.9 }}
        >
          Bienvenue dans notre boutique en ligne
        </p>
        <Button 
          className="px-6 py-2 rounded-md font-medium transition-all hover:shadow-md"
          style={{ 
            backgroundColor: accentColor,
            color: primaryColor
          }}
        >
          Découvrir
        </Button>
      </div>

      {/* Product Card Preview */}
      <div 
        className="p-4 rounded-lg border"
        style={{ backgroundColor: secondaryColor, borderColor: accentColor + '20' }}
      >
        <div 
          className="w-full h-32 rounded-md mb-3"
          style={{ backgroundColor: primaryColor, opacity: 0.1 }}
        />
        <h4 
          className="font-semibold mb-2"
          style={{ color: primaryColor }}
        >
          Produit Example
        </h4>
        <p 
          className="text-sm mb-3"
          style={{ color: primaryColor, opacity: 0.7 }}
        >
          Description du produit avec tous les détails importants
        </p>
        <div className="flex items-center justify-between">
          <span 
            className="font-bold text-lg"
            style={{ color: accentColor }}
          >
            29,99 €
          </span>
          <Button 
            size="sm"
            className="px-4 py-1 rounded text-sm"
            style={{ 
              backgroundColor: primaryColor,
              color: secondaryColor
            }}
          >
            Ajouter
          </Button>
        </div>
      </div>
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
                style={{ backgroundColor: color as string }}
                title={name}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};