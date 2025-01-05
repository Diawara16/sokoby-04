import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Check } from "lucide-react";
import { ThemeTemplate } from "@/types/theme";
import { ColorPicker } from "./theme/ColorPicker";
import { TypographyPicker } from "./theme/TypographyPicker";
import { LayoutPicker } from "./theme/LayoutPicker";
import { ThemePreview } from "./theme/ThemePreview";
import { TemplateSelector } from "./theme/TemplateSelector";

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
  const [layoutStyle, setLayoutStyle] = useState("");
  const [spacing, setSpacing] = useState("");
  const [headingFont, setHeadingFont] = useState("");
  const [bodyFont, setBodyFont] = useState("");
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
        setAccentColor(data[0].colors.accent || "#000000");
        setLayoutStyle(data[0].layout.spacing);
        setSpacing(data[0].layout.containerWidth);
        setHeadingFont(data[0].typography.fontFamily);
        setBodyFont(data[0].typography.fontSize);
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
      setAccentColor(template.colors.accent || "#000000");
      setLayoutStyle(template.layout.spacing);
      setSpacing(template.layout.containerWidth);
      setHeadingFont(template.typography.fontFamily);
      setBodyFont(template.typography.fontSize);
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
          <TemplateSelector
            templates={templates}
            selectedTemplateId={selectedTemplate?.id}
            onTemplateChange={handleTemplateChange}
          />

          <ColorPicker
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            onPrimaryChange={setPrimaryColor}
            onSecondaryChange={setSecondaryColor}
            onAccentChange={setAccentColor}
          />

          <TypographyPicker
            headingFont={headingFont}
            bodyFont={bodyFont}
            onHeadingChange={setHeadingFont}
            onBodyChange={setBodyFont}
          />

          <LayoutPicker
            layoutStyle={layoutStyle}
            spacing={spacing}
            onLayoutChange={setLayoutStyle}
            onSpacingChange={setSpacing}
          />
        </div>

        <ThemePreview
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          selectedTemplate={selectedTemplate}
        />
      </div>
    </div>
  );
};