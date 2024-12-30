import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ThemeCard } from "@/components/themes/ThemeCard";
import { themes } from "@/data/themes";
import { useThemeOperations } from "@/hooks/useThemeOperations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const Themes = () => {
  const [selectedTheme, setSelectedTheme] = useState<'free' | 'private'>('free');
  const { toast } = useToast();
  const { applyTheme } = useThemeOperations();
  const navigate = useNavigate();

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
        navigate("/login");
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
      <h1 className="text-2xl font-bold mb-6">Thèmes Disponibles</h1>
      
      <div className="flex gap-4 mb-8">
        <Button
          className={selectedTheme === 'free' ? 'bg-red-700 hover:bg-red-800' : 'border-red-700 text-red-700 hover:bg-red-50'}
          variant={selectedTheme === 'free' ? 'default' : 'outline'}
          onClick={() => setSelectedTheme('free')}
        >
          Thème Gratuit
        </Button>
        <Button
          className={selectedTheme === 'private' ? 'bg-red-700 hover:bg-red-800' : 'border-red-700 text-red-700 hover:bg-red-50'}
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

      <Alert variant="destructive" className="mt-8">
        <AlertDescription>
          Vous devez être connecté pour appliquer un thème
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Themes;