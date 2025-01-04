import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Palette, Type, Layout, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  niche: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  layout: {
    style: string;
    spacing: string;
  };
}

interface ThemeEditorProps {
  niche: string;
  onComplete: (themeId: string) => void;
}

export const ThemeEditor = ({ niche, onComplete }: ThemeEditorProps) => {
  const [templates, setTemplates] = useState<ThemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ThemeTemplate | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [accentColor, setAccentColor] = useState("#000000");
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, [niche]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_templates')
        .select('*')
        .eq('niche', niche);

      if (error) throw error;

      setTemplates(data);
      if (data.length > 0) {
        setSelectedTemplate(data[0]);
        setPrimaryColor(data[0].colors.primary);
        setSecondaryColor(data[0].colors.secondary);
        setAccentColor(data[0].colors.accent);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates",
        variant: "destructive",
      });
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setPrimaryColor(template.colors.primary);
      setSecondaryColor(template.colors.secondary);
      setAccentColor(template.colors.accent);
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedTemplate) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from('brand_settings')
        .upsert({
          user_id: user.id,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Thème appliqué avec succès",
      });

      onComplete(selectedTemplate.id);
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer le thème",
        variant: "destructive",
      });
    }
  };

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Personnalisation du thème</h2>
        <Button onClick={handleSave}>
          <Check className="mr-2 h-4 w-4" />
          Appliquer le thème
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Template de base
            </h3>
            <Select
              value={selectedTemplate?.id}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

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
                  onChange={(e) => setPrimaryColor(e.target.value)}
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
                  onChange={(e) => setSecondaryColor(e.target.value)}
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
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Type className="h-5 w-5" />
              Typographie
            </h3>
            <div className="space-y-4">
              <Select defaultValue={selectedTemplate?.typography.heading}>
                <SelectTrigger>
                  <SelectValue placeholder="Police des titres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Lora">Lora</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue={selectedTemplate?.typography.body}>
                <SelectTrigger>
                  <SelectValue placeholder="Police du texte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Raleway">Raleway</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Mise en page
            </h3>
            <div className="space-y-4">
              <Select defaultValue={selectedTemplate?.layout.style}>
                <SelectTrigger>
                  <SelectValue placeholder="Style de mise en page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="grid">Grille</SelectItem>
                  <SelectItem value="organic">Organique</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue={selectedTemplate?.layout.spacing}>
                <SelectTrigger>
                  <SelectValue placeholder="Espacement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="airy">Aéré</SelectItem>
                  <SelectItem value="breathable">Respirable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Aperçu en direct</h3>
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
      </div>
    </div>
  );
};