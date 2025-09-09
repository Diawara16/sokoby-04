import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Palette, Paintbrush, Layout, Type, Eye, Check, Settings, Save, Filter } from "lucide-react";
import minimalPreview from "@/assets/theme-previews/minimal-preview.jpg";
import boutiquePreview from "@/assets/theme-previews/boutique-preview.jpg";
import techPreview from "@/assets/theme-previews/tech-preview.jpg";
import naturePreview from "@/assets/theme-previews/nature-preview.jpg";
import fashionPreview from "@/assets/theme-previews/fashion-preview.jpg";
import sportsPreview from "@/assets/theme-previews/sports-preview.jpg";
import creativePreview from "@/assets/theme-previews/creative-preview.jpg";
import professionalPreview from "@/assets/theme-previews/professional-preview.jpg";
import jewelryPreview from "@/assets/theme-previews/jewelry-preview.jpg";
import homePreview from "@/assets/theme-previews/home-preview.jpg";
import foodPreview from "@/assets/theme-previews/food-preview.jpg";
import kidsPreview from "@/assets/theme-previews/kids-preview.jpg";
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
  preview_image: string;
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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
          preview_image: minimalPreview,
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
          preview_image: boutiquePreview,
          config: {
            colors: { primary: '#8B4513', secondary: '#FFF8DC', accent: '#d97706' },
            fonts: { primary: 'Inter', headings: 'Playfair Display' }
          }
        },
        {
          id: 'tech',
          name: 'Tech',
          description: 'Style moderne pour les boutiques technologiques',
          category: 'technology',
          is_premium: false,
          preview_image: techPreview,
          config: {
            colors: { primary: '#1e40af', secondary: '#1f2937', accent: '#3b82f6' },
            fonts: { primary: 'Inter', headings: 'Inter' }
          }
        },
        {
          id: 'nature',
          name: 'Nature',
          description: 'Inspiré par la nature, tons verts et organiques',
          category: 'organic',
          is_premium: false,
          preview_image: naturePreview,
          config: {
            colors: { primary: '#27ae60', secondary: '#f1c40f', accent: '#2ecc71' },
            fonts: { primary: 'Inter', headings: 'Merriweather' }
          }
        },
        {
          id: 'fashion',
          name: 'Fashion',
          description: 'Élégant et sophistiqué pour les marques de mode',
          category: 'fashion',
          is_premium: false,
          preview_image: fashionPreview,
          config: {
            colors: { primary: '#000000', secondary: '#ffffff', accent: '#dc2626' },
            fonts: { primary: 'Inter', headings: 'Playfair Display' }
          }
        },
        {
          id: 'sports',
          name: 'Sports',
          description: 'Énergique et dynamique pour les boutiques sportives',
          category: 'sports',
          is_premium: false,
          preview_image: sportsPreview,
          config: {
            colors: { primary: '#ea580c', secondary: '#1e40af', accent: '#facc15' },
            fonts: { primary: 'Inter', headings: 'Montserrat' }
          }
        },
        {
          id: 'creative',
          name: 'Creative',
          description: 'Artistique et coloré pour les créateurs',
          category: 'creative',
          is_premium: false,
          preview_image: creativePreview,
          config: {
            colors: { primary: '#8b5cf6', secondary: '#ec4899', accent: '#06b6d4' },
            fonts: { primary: 'Inter', headings: 'Poppins' }
          }
        },
        {
          id: 'professional',
          name: 'Professional',
          description: 'Classique et professionnel pour les entreprises',
          category: 'business',
          is_premium: false,
          preview_image: professionalPreview,
          config: {
            colors: { primary: '#1e40af', secondary: '#f59e0b', accent: '#374151' },
            fonts: { primary: 'Inter', headings: 'Inter' }
          }
        },
        {
          id: 'jewelry',
          name: 'Jewelry',
          description: 'Luxueux et raffiné pour les bijouteries',
          category: 'luxury',
          is_premium: false,
          preview_image: jewelryPreview,
          config: {
            colors: { primary: '#d4af37', secondary: '#1a1a1a', accent: '#ffd700' },
            fonts: { primary: 'Inter', headings: 'Playfair Display' }
          }
        },
        {
          id: 'home',
          name: 'Home & Decor',
          description: 'Chaleureux et accueillant pour la décoration',
          category: 'home',
          is_premium: false,
          preview_image: homePreview,
          config: {
            colors: { primary: '#8b7355', secondary: '#f5f5dc', accent: '#cd853f' },
            fonts: { primary: 'Inter', headings: 'Merriweather' }
          }
        },
        {
          id: 'food',
          name: 'Fresh Food',
          description: 'Frais et appétissant pour l\'alimentation',
          category: 'food',
          is_premium: false,
          preview_image: foodPreview,
          config: {
            colors: { primary: '#22c55e', secondary: '#ffffff', accent: '#16a34a' },
            fonts: { primary: 'Inter', headings: 'Poppins' }
          }
        },
        {
          id: 'kids',
          name: 'Kids & Toys',
          description: 'Ludique et coloré pour les enfants',
          category: 'kids',
          is_premium: false,
          preview_image: kidsPreview,
          config: {
            colors: { primary: '#ff6b35', secondary: '#4ecdc4', accent: '#ffe66d' },
            fonts: { primary: 'Inter', headings: 'Poppins' }
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
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-base font-semibold">Galerie de thèmes gratuits</h4>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="business">Business</option>
                  <option value="fashion">Mode</option>
                  <option value="technology">Technologie</option>
                  <option value="organic">Nature & Bio</option>
                  <option value="sports">Sport</option>
                  <option value="creative">Créatif</option>
                  <option value="luxury">Luxe</option>
                  <option value="home">Maison & Déco</option>
                  <option value="food">Alimentation</option>
                  <option value="kids">Enfants</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {themes
                .filter(theme => selectedCategory === "all" || theme.category === selectedCategory)
                .filter(theme => !theme.is_premium)
                .map((theme) => (
                <Card 
                  key={theme.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] overflow-hidden ${
                    selectedTheme === theme.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                >
                  {/* Preview Image */}
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={theme.preview_image}
                      alt={`Preview of ${theme.name} theme`}
                      className="w-full h-full object-cover"
                    />
                    {selectedTheme === theme.id && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {theme.name}
                        <Badge variant="secondary" className="text-xs">
                          Gratuit
                        </Badge>
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
                      {theme.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Color Palette */}
                    <div className="mb-4">
                      <div className="flex gap-1 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: theme.config.colors.primary }}
                          title="Couleur principale"
                        />
                        <div 
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: theme.config.colors.secondary }}
                          title="Couleur secondaire"
                        />
                        {theme.config.colors.accent && (
                          <div 
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: theme.config.colors.accent }}
                            title="Couleur d'accent"
                          />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {theme.config.fonts.headings}
                      </div>
                    </div>

                    <Button
                      variant={selectedTheme === theme.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleThemeSelect(theme)}
                      className="w-full"
                      disabled={saving}
                    >
                      {saving ? "Application..." : selectedTheme === theme.id ? "Thème actif" : "Utiliser ce thème"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Premium Themes Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-base font-semibold">Thèmes Premium</h4>
                <Badge variant="outline">Bientôt disponible</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-60">
                {themes
                  .filter(theme => theme.is_premium)
                  .slice(0, 4)
                  .map((theme) => (
                  <Card key={theme.id} className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center">
                      <Badge className="bg-white text-black">Bientôt</Badge>
                    </div>
                    <div className="aspect-video bg-muted">
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-base">{theme.name}</CardTitle>
                      <CardDescription className="text-sm">{theme.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
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