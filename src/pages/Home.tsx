import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

export default function Home() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthAndProfile();

  const testOrderNotification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour tester les notifications",
          variant: "destructive",
        });
        return;
      }

      // Créer une notification de test
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Nouvelle commande reçue',
          content: 'Commande test #123 créée avec succès',
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Notification de test envoyée",
      });

    } catch (error) {
      console.error('Erreur lors du test:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification de test",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Bienvenue sur Sokoby</h1>
      
      {!isAuthenticated ? (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Connectez-vous pour commencer</h2>
          <p className="text-gray-600 mb-4">Pour tester les fonctionnalités de Sokoby, vous devez d'abord vous connecter.</p>
          <Button 
            onClick={() => navigate('/connexion')}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Se connecter
          </Button>
        </div>
      ) : (
        <div className="mb-8">
          <Button 
            onClick={testOrderNotification}
            className="bg-red-600 text-white flex items-center gap-2 hover:bg-red-700"
          >
            <Bell className="h-5 w-5" />
            Tester le son de notification
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <h2 className="text-2xl font-semibold">Nos services</h2>
        <p>Découvrez nos services et comment nous pouvons vous aider à développer votre entreprise.</p>
        <p>Nous offrons une variété de solutions adaptées à vos besoins.</p>
      </div>
    </div>
  );
}