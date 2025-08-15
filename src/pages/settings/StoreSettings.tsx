import { StoreSettings as StoreSettingsComponent } from "@/components/store/StoreSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface StoreSettingsProps {
  showDomainOnly?: boolean;
}

const StoreSettings = ({ showDomainOnly }: StoreSettingsProps) => {
  const { toast } = useToast();

  const handleCloseStore = async () => {
    try {
      // First cancel subscription if active
      const { data, error } = await supabase.functions.invoke('create-billing-portal-session');
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Portail de facturation ouvert",
          description: "Veuillez d'abord annuler votre abonnement, puis revenez pour fermer votre boutique.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Contactez le support pour fermer votre boutique: support@exemple.com",
        variant: "destructive",
      });
    }
  };
  if (showDomainOnly) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Configuration du nom de domaine</h1>
        <Card className="p-6">
          <StoreSettingsComponent showDomainOnly />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres de la boutique</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="domain">Nom de domaine</TabsTrigger>
          <TabsTrigger value="danger">Zone de danger</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <StoreSettingsComponent />
          </Card>
        </TabsContent>

        <TabsContent value="domain">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Configuration du nom de domaine</h2>
            <StoreSettingsComponent showDomainOnly />
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Zone de danger
            </h2>
            
            <div className="space-y-6">
              <div className="border border-red-200 rounded-lg p-4 bg-white">
                <h3 className="font-medium mb-2 text-red-800">Fermer définitivement la boutique</h3>
                <p className="text-sm text-red-600 mb-4">
                  Cette action fermera définitivement votre boutique et annulera votre abonnement. 
                  Toutes vos données seront supprimées et cette action est irréversible.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Fermer la boutique
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir fermer votre boutique ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Votre boutique sera fermée définitivement, 
                        votre abonnement sera annulé et toutes vos données seront supprimées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCloseStore} className="bg-red-600 hover:bg-red-700">
                        Fermer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <h3 className="font-medium mb-2 text-orange-800">Besoin d'aide ?</h3>
                <p className="text-sm text-orange-700 mb-3">
                  Si vous rencontrez des problèmes ou avez des questions avant de fermer votre boutique :
                </p>
                <ul className="text-sm text-orange-700 list-disc list-inside space-y-1">
                  <li>Contactez notre support : support@exemple.com</li>
                  <li>Consultez notre centre d'aide</li>
                  <li>Utilisez le chat en direct</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreSettings;