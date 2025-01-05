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
        setTemplates(data);
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
        description: "Impossible de charger les modèles",
        variant: "destructive",
      });
    }
  };

  const handleTemplateChange = (template: ThemeTemplate) => {
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