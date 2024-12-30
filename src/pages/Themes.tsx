import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { ThemeCard } from "@/components/themes/ThemeCard";
import { themes } from "@/data/themes";
import { useThemeOperations } from "@/hooks/useThemeOperations";

const Themes = () => {
  const [selectedTheme, setSelectedTheme] = useState<'free' | 'private'>('free');
  const { toast } = useToast();
  const { applyTheme } = useThemeOperations();

  const currentTheme = themes[selectedTheme];

  const handleApplyTheme = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour appliquer un thème",
          variant: "destructive",
        });
        return;
      }

      await applyTheme(user.id, currentTheme.colors);

    } catch (error) {
      console.error('Erreur lors de l\'application du thème:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'application du thème",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thèmes Disponibles</h1>
      
      <div className="flex gap-4 mb-8">
        <Button
          className={`${selectedTheme === 'free' ? 'bg-red-700 hover:bg-red-800' : ''}`}
          variant={selectedTheme === 'free' ? 'default' : 'outline'}
          onClick={() => setSelectedTheme('free')}
        >
          Thème Gratuit
        </Button>
        <Button
          className={`${selectedTheme === 'private' ? 'bg-red-700 hover:bg-red-800' : ''}`}
          variant={selectedTheme === 'private' ? 'default' : 'outline'}
          onClick={() => setSelectedTheme('private')}
        >
          Thème Premium
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ThemeCard
          theme={currentTheme}
          onApply={handleApplyTheme}
          isSelected={selectedTheme === 'free'}
        />

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