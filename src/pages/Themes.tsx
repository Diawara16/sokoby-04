import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const Themes = () => {
  const [selectedTheme, setSelectedTheme] = useState<'free' | 'private'>('free');

  const themes = {
    free: {
      name: "Thème Gratuit",
      description: "Un design élégant et professionnel pour votre boutique",
      features: [
        "Design responsive",
        "Palette de couleurs harmonieuse",
        "Navigation intuitive",
        "Optimisé pour mobile"
      ],
      preview: "/placeholder.svg",
      colors: {
        primary: "#8E9196",
        secondary: "#D6BCFA",
        accent: "#F2FCE2",
        background: "#FFFFFF"
      }
    },
    private: {
      name: "Thème Premium",
      description: "Un thème exclusif avec des fonctionnalités avancées",
      features: [
        "Animations personnalisées",
        "Mise en page premium",
        "Effets visuels exclusifs",
        "Options de personnalisation avancées"
      ],
      preview: "/placeholder.svg",
      colors: {
        primary: "#1A1F2C",
        secondary: "#7E69AB",
        accent: "#F1F0FB",
        background: "#221F26"
      }
    }
  };

  const currentTheme = themes[selectedTheme];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thèmes Disponibles</h1>
      
      <div className="flex gap-4 mb-8">
        <Button
          variant={selectedTheme === 'free' ? 'default' : 'outline'}
          onClick={() => setSelectedTheme('free')}
        >
          Thème Gratuit
        </Button>
        <Button
          variant={selectedTheme === 'private' ? 'default' : 'outline'}
          onClick={() => setSelectedTheme('private')}
        >
          Thème Premium
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{currentTheme.name}</h2>
          <p className="text-gray-600 mb-6">{currentTheme.description}</p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Caractéristiques :</h3>
            <ul className="space-y-2">
              {currentTheme.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Palette de couleurs :</h3>
            <div className="flex gap-2">
              {Object.entries(currentTheme.colors).map(([name, color]) => (
                <div
                  key={name}
                  className="w-10 h-10 rounded-full border"
                  style={{ backgroundColor: color }}
                  title={name}
                />
              ))}
            </div>
          </div>

          <Button className="w-full">
            {selectedTheme === 'free' ? 'Utiliser ce thème' : 'Passer à la version Premium'}
          </Button>
        </Card>

        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={currentTheme.preview}
            alt={`Aperçu du ${currentTheme.name}`}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Themes;