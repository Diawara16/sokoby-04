import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Palette, Paintbrush, Layout, Type, Eye, Check, Settings, Save } from "lucide-react";
import { ColorPicker } from "@/components/store-creator/theme/ColorPicker";
import { TypographyPicker } from "@/components/store-creator/theme/TypographyPicker";
import { LayoutPicker } from "@/components/store-creator/theme/LayoutPicker";
import { ThemePreview } from "@/components/store-creator/theme/ThemePreview";

interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  is_premium: boolean;
  config: {
    colors: {
      primary: string;
      secondary: string;
      accent?: string;
    };
    fonts: {
      primary: string;
      headings: string;
    };
  };
}

interface AdvancedSettings {
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontSize: string;
  headingFont: string;
  spacing: string;
  containerWidth: string;
}

export default function DesignSettings() {
  const [themes, setThemes] = useState<ThemeTemplate[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Advanced customization state
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    accentColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: "0.5rem",
    fontSize: "16px",
    headingFont: "Inter",
    spacing: "comfortable",
    containerWidth: "1200px"
  });

  useEffect(() => {
    fetchThemes();
    loadAdvancedSettings();
  }, []);

  const loadAdvancedSettings = () => {
    const saved = localStorage.getItem('advanced-design-settings');
    if (saved) {
      setAdvancedSettings(JSON.parse(saved));
    }
  };

  const saveAdvancedSettings = () => {
    localStorage.setItem('advanced-design-settings', JSON.stringify(advancedSettings));
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos paramètres de design avancés ont été sauvegardés"
    });
  };

  const fetchThemes = async () => {
    try {
      const predefinedThemes: ThemeTemplate[] = [
        {
          id: 'minimal',
          name: 'Minimal',
          description: 'Design épuré et moderne, parfait pour les boutiques élégantes',
          category: 'business',
          is_premium: false,
          config: {
            colors: { primary: '#000000', secondary: '#f8f9fa', accent: '#6366f1' },
            fonts: { primary: 'Inter', headings: 'Inter' }
          }
        },
        {
          id: 'boutique',
          name: 'Boutique',
          description: 'Design chaleureux pour les boutiques artisanales',
          category: 'fashion',
          is_premium: false,
          config: {
            colors: { primary: '#8B4513', secondary: '#FFF8DC', accent: '#d97706' },
            fonts: { primary: 'Inter', headings: 'Playfair Display' }
          }
        },
        {
          id: 'editorial',
          name: 'Editorial',
          description: 'Style magazine pour les marques de contenu',
          category: 'media',
          is_premium: true,
          config: {
            colors: { primary: '#2c3e50', secondary: '#ecf0f1', accent: '#3498db' },
            fonts: { primary: 'Georgia', headings: 'Playfair Display' }
          }
        },
        {
          id: 'bold',
          name: 'Bold',
          description: 'Design audacieux pour se démarquer',
          category: 'creative',
          is_premium: true,
          config: {
            colors: { primary: '#e74c3c', secondary: '#34495e', accent: '#f39c12' },
            fonts: { primary: 'Inter', headings: 'Montserrat' }
          }
        },
        {
          id: 'nature',
          name: 'Nature',
          description: 'Inspiré par la nature, tons verts et organiques',
          category: 'organic',
          is_premium: false,
          config: {
            colors: { primary: '#27ae60', secondary: '#f1c40f', accent: '#2ecc71' },
            fonts: { primary: 'Inter', headings: 'Merriweather' }
          }
        }
      ];

      setThemes(predefinedThemes);
      
      // Load selected theme from brand settings
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: brandSettings } = await supabase
          .from('brand_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (brandSettings) {
          const matchingTheme = predefinedThemes.find(theme => 
            theme.config.colors.primary === brandSettings.primary_color
          );
          if (matchingTheme) {
            setSelectedTheme(matchingTheme.id);
          }
        }
      }
    } catch (error) {
      console.error('Error loading themes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les thèmes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = async (theme: ThemeTemplate) => {
    setSaving(true);
    try {
      setSelectedTheme(theme.id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('brand_settings')
        .upsert({
          user_id: user.id,
          primary_color: theme.config.colors.primary,
          secondary_color: theme.config.colors.secondary,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Thème appliqué",
        description: `Le thème ${theme.name} a été appliqué avec succès`,
      });
    } catch (error) {
      console.error('Error applying theme:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer le thème",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const currentTheme = themes.find(t => t.id === selectedTheme);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Paramètres de design</h3>
        <p className="text-sm text-muted-foreground">
          Personnalisez l'apparence de votre boutique avec des thèmes professionnels et des options avancées.
        </p>
      </div>

      <Tabs defaultValue="themes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Thèmes
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Avancé
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Aperçu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6">
          <div>
            <h4 className="text-base font-semibold mb-4">Galerie de thèmes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <Card 
                  key={theme.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                    selectedTheme === theme.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Paintbrush className="h-4 w-4" />
                        {theme.name}
                        {selectedTheme === theme.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </CardTitle>
                      {theme.is_premium && (
                        <Badge variant="secondary">Premium</Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {theme.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Enhanced Theme Preview */}
                    <div className="mb-4 p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex gap-1">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: theme.config.colors.primary }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: theme.config.colors.secondary }}
                          />
                          {theme.config.colors.accent && (
                            <div 
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: theme.config.colors.accent }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div 
                          className="text-sm font-medium"
                          style={{ fontFamily: theme.config.fonts.headings }}
                        >
                          {theme.config.fonts.headings}
                        </div>
                        <div 
                          className="text-xs text-muted-foreground"
                          style={{ fontFamily: theme.config.fonts.primary }}
                        >
                          Corps: {theme.config.fonts.primary}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant={selectedTheme === theme.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleThemeSelect(theme)}
                      className="w-full"
                      disabled={theme.is_premium || saving}
                    >
                      {saving ? "Application..." : selectedTheme === theme.id ? "Appliqué" : "Utiliser ce thème"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Couleurs personnalisées
                </CardTitle>
                <CardDescription>
                  Ajustez les couleurs au-delà du thème sélectionné
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorPicker
                  label="Couleur d'accent"
                  value={advancedSettings.accentColor}
                  onChange={(value) => setAdvancedSettings(prev => ({ ...prev, accentColor: value }))}
                />
                <ColorPicker
                  label="Arrière-plan"
                  value={advancedSettings.backgroundColor}
                  onChange={(value) => setAdvancedSettings(prev => ({ ...prev, backgroundColor: value }))}
                />
                <ColorPicker
                  label="Couleur du texte"
                  value={advancedSettings.textColor}
                  onChange={(value) => setAdvancedSettings(prev => ({ ...prev, textColor: value }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Typographie avancée
                </CardTitle>
                <CardDescription>
                  Personnalisez les polices et la taille du texte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TypographyPicker
                  fontFamily={advancedSettings.headingFont}
                  fontSize={advancedSettings.fontSize}
                  onFontFamilyChange={(value) => setAdvancedSettings(prev => ({ ...prev, headingFont: value }))}
                  onFontSizeChange={(value) => setAdvancedSettings(prev => ({ ...prev, fontSize: value }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Mise en page
                </CardTitle>
                <CardDescription>
                  Contrôlez l'espacement et la largeur du contenu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <LayoutPicker
                  spacing={advancedSettings.spacing}
                  containerWidth={advancedSettings.containerWidth}
                  onSpacingChange={(value) => setAdvancedSettings(prev => ({ ...prev, spacing: value }))}
                  onContainerWidthChange={(value) => setAdvancedSettings(prev => ({ ...prev, containerWidth: value }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Sauvegardez vos paramètres personnalisés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={saveAdvancedSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les paramètres
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {currentTheme && (
            <ThemePreview
              primaryColor={currentTheme.config.colors.primary}
              secondaryColor={currentTheme.config.colors.secondary}
              accentColor={advancedSettings.accentColor}
              selectedTemplate={null}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}