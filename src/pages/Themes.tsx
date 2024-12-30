import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ThemeCard } from "@/components/themes/ThemeCard";
import { themes } from "@/data/themes";
import { useThemeOperations } from "@/hooks/useThemeOperations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const Themes = () => {
  const [selectedTheme, setSelectedTheme] = useState<'free' | 'private'>('free');
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredThemes = Object.entries(themes).filter(([_, theme]) =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.features.some(feature => 
      feature.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thèmes Disponibles</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
          Rechercher un thème
        </Button>
      </div>
      
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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Rechercher un thème..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>Aucun thème trouvé.</CommandEmpty>
          <CommandGroup heading="Thèmes disponibles">
            {filteredThemes.map(([key, theme]) => (
              <CommandItem
                key={key}
                onSelect={() => {
                  setSelectedTheme(key as 'free' | 'private');
                  setOpen(false);
                }}
                className="flex items-start gap-4 p-4 cursor-pointer"
              >
                <div>
                  <h3 className="font-semibold">{theme.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                  <div className="flex gap-2 mt-2">
                    {Object.entries(theme.colors).map(([name, color]) => (
                      <div
                        key={name}
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color }}
                        title={name}
                      />
                    ))}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default Themes;