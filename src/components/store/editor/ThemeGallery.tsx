import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Palette, Check, Eye } from "lucide-react";
import { applyThemeToDOM } from "@/utils/themeUtils";

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
    };
    fonts: {
      primary: string;
      headings: string;
    };
  };
}

interface ThemeGalleryProps {
  onThemeSelect: (theme: ThemeTemplate) => void;
  selectedTheme?: string;
}

export const ThemeGallery = ({ onThemeSelect, selectedTheme }: ThemeGalleryProps) => {
  const [themes, setThemes] = useState<ThemeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      // For now, using predefined themes until theme_templates table is properly created
      const predefinedThemes: ThemeTemplate[] = [
        {
          id: 'minimal',
          name: 'Minimal',
          description: 'Design épuré et moderne, parfait pour les boutiques élégantes',
          category: 'business',
          is_premium: false,
          config: {
            colors: { primary: '#000000', secondary: '#f8f9fa' },
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
            colors: { primary: '#8B4513', secondary: '#FFF8DC' },
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
            colors: { primary: '#2c3e50', secondary: '#ecf0f1' },
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
            colors: { primary: '#e74c3c', secondary: '#34495e' },
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
            colors: { primary: '#27ae60', secondary: '#f1c40f' },
            fonts: { primary: 'Inter', headings: 'Merriweather' }
          }
        }
      ];

      setThemes(predefinedThemes);
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
    try {
      onThemeSelect(theme);
      
      // Apply theme to brand settings
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

      // Immediately apply theme to DOM for instant visual feedback
      applyThemeToDOM(theme.config.colors.primary, theme.config.colors.secondary);

      toast({
        title: "Thème appliqué",
        description: `Le thème ${theme.name} a été appliqué avec succès. Les changements sont visibles immédiatement.`,
      });
    } catch (error) {
      console.error('Error applying theme:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer le thème",
        variant: "destructive"
      });
    }
  };

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
        <h3 className="text-lg font-semibold mb-2">Galerie de thèmes</h3>
        <p className="text-muted-foreground">
          Choisissez un thème professionnel pour votre boutique
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card 
            key={theme.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedTheme === theme.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4" />
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
              {/* Theme Preview */}
              <div className="mb-3 p-3 rounded border bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.config.colors.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.config.colors.secondary }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {theme.config.fonts.headings}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Police: {theme.config.fonts.primary}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={selectedTheme === theme.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeSelect(theme)}
                  className="flex-1"
                  disabled={theme.is_premium}
                >
                  {selectedTheme === theme.id ? "Appliqué" : "Utiliser"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Preview functionality would open theme in new tab
                    toast({
                      title: "Aperçu",
                      description: "Fonctionnalité bientôt disponible"
                    });
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};