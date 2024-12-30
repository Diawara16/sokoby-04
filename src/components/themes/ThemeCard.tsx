import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Theme } from "@/types/theme";

interface ThemeCardProps {
  theme: Theme;
  onApply: () => void;
  isSelected: boolean;
}

export const ThemeCard = ({ theme, onApply, isSelected }: ThemeCardProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{theme.name}</h2>
      <p className="text-gray-600 mb-6">{theme.description}</p>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Caractéristiques :</h3>
        <ul className="space-y-2">
          {theme.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Palette de couleurs :</h3>
        <div className="flex gap-2">
          {Object.entries(theme.colors).map(([name, color]) => (
            <div
              key={name}
              className="w-10 h-10 rounded-full border"
              style={{ backgroundColor: color }}
              title={name}
            />
          ))}
        </div>
      </div>

      <Button 
        className="w-full bg-red-700 hover:bg-red-800"
        onClick={onApply}
      >
        {isSelected ? 'Utiliser ce thème' : 'Passer à la version Premium'}
      </Button>
    </Card>
  );
};