import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ThemeTemplate } from '@/types/theme';
import { ColorPicker } from './theme/ColorPicker';
import { LayoutPicker } from './theme/LayoutPicker';
import { TypographyPicker } from './theme/TypographyPicker';
import { TemplateSelector } from './theme/TemplateSelector';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function ThemeEditor() {
  const [templates, setTemplates] = useState<ThemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ThemeTemplate | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  const [accentColor, setAccentColor] = useState('#000000');
  const [layoutStyle, setLayoutStyle] = useState('');
  const [spacing, setSpacing] = useState('');
  const [headingFont, setHeadingFont] = useState('');
  const [bodyFont, setBodyFont] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_templates')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        const typedData = data.map(template => ({
          ...template,
          colors: template.colors as any,
          layout: template.layout as any,
          typography: template.typography as any
        })) as ThemeTemplate[];
        
        setTemplates(typedData);
        setSelectedTemplate(typedData[0]);
        setPrimaryColor((typedData[0].colors as any)?.primary || "#000000");
        setSecondaryColor((typedData[0].colors as any)?.secondary || "#000000");
        setAccentColor((typedData[0].colors as any)?.accent || "#000000");
        setLayoutStyle((typedData[0].layout as any)?.spacing || "");
        setSpacing((typedData[0].layout as any)?.containerWidth || "");
        setHeadingFont((typedData[0].typography as any)?.fontFamily || "");
        setBodyFont((typedData[0].typography as any)?.fontSize || "");
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les modèles",
        variant: "destructive",
      });
    }
  };

  const handleTemplateChange = (template: ThemeTemplate) => {
    if (template) {
      setSelectedTemplate(template);
      setPrimaryColor((template.colors as any)?.primary || "#000000");
      setSecondaryColor((template.colors as any)?.secondary || "#000000");
      setAccentColor((template.colors as any)?.accent || "#000000");
      setLayoutStyle((template.layout as any)?.spacing || "");
      setSpacing((template.layout as any)?.containerWidth || "");
      setHeadingFont((template.typography as any)?.fontFamily || "");
      setBodyFont((template.typography as any)?.fontSize || "");
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <TemplateSelector
          templates={templates}
          selectedTemplate={selectedTemplate}
          onTemplateChange={handleTemplateChange}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Couleurs</h3>
          <ColorPicker
            label="Couleur principale"
            value={primaryColor}
            onChange={setPrimaryColor}
          />
          <ColorPicker
            label="Couleur secondaire"
            value={secondaryColor}
            onChange={setSecondaryColor}
          />
          <ColorPicker
            label="Couleur d'accent"
            value={accentColor}
            onChange={setAccentColor}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Mise en page</h3>
          <LayoutPicker
            spacing={layoutStyle}
            containerWidth={spacing}
            onSpacingChange={setLayoutStyle}
            onContainerWidthChange={setSpacing}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Typographie</h3>
          <TypographyPicker
            fontFamily={headingFont}
            fontSize={bodyFont}
            onFontFamilyChange={setHeadingFont}
            onFontSizeChange={setBodyFont}
          />
        </div>
      </CardContent>
    </Card>
  );
}