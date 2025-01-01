import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Theme } from "@/types/theme";
import { Crown, Gift, Check } from "lucide-react";

interface ThemeCardProps {
  theme: Theme;
  onApply: () => void;
  isSelected: boolean;
}

export const ThemeCard = ({ theme, onApply, isSelected }: ThemeCardProps) => {
  const isPremium = theme.price > 0;

  return (
    <Card className={`p-6 transition-all duration-300 ${
      isPremium 
        ? "bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl hover:-translate-y-1" 
        : "hover:shadow-md"
    }`}>
      <div className="relative">
        {isPremium && (
          <div className="absolute -top-2 -right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Crown className="w-4 h-4" />
            Premium
          </div>
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              {!isPremium && <Gift className="w-5 h-5 text-gray-500" />}
              {theme.name}
            </h2>
            <p className="text-gray-600 mt-1">{theme.description}</p>
          </div>
          <div className={`text-xl font-bold ${isPremium ? "text-purple-600" : "text-gray-600"}`}>
            {theme.price === 0 ? "Gratuit" : `${theme.price}€`}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Caractéristiques :</h3>
            <ul className="space-y-2">
              {theme.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className={`w-4 h-4 ${
                    isPremium ? "text-purple-500" : "text-gray-500"
                  }`} />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Palette de couleurs :</h3>
            <div className="flex gap-2">
              {Object.entries(theme.colors).map(([name, color]) => (
                <div
                  key={name}
                  className="w-8 h-8 rounded-full border shadow-sm"
                  style={{ backgroundColor: color }}
                  title={name}
                />
              ))}
            </div>
          </div>

          <Button 
            className={`w-full ${
              isPremium 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-gray-600 hover:bg-gray-700"
            }`}
            onClick={onApply}
          >
            {theme.price === 0 
              ? (isSelected ? "Thème actif" : "Utiliser ce thème")
              : (isSelected ? "Thème actif" : "Passer au Premium")}
          </Button>
        </div>
      </div>
    </Card>
  );
};