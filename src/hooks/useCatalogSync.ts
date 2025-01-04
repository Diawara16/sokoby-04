import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useCatalogSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const syncCatalog = async (integrationId: string, productIds: string[]) => {
    setIsSyncing(true);
    try {
      // Créer une nouvelle entrée dans l'historique de synchronisation
      const { data: syncHistory, error: historyError } = await supabase
        .from('sync_history')
        .insert({
          integration_id: integrationId,
          sync_type: 'catalog',
          status: 'in_progress'
        })
        .select()
        .single();

      if (historyError) throw historyError;

      // Créer ou mettre à jour les éléments du catalogue
      const { error: catalogError } = await supabase
        .from('social_catalog_items')
        .upsert(
          productIds.map(productId => ({
            integration_id: integrationId,
            product_id: productId,
            sync_status: 'pending',
            last_sync_at: new Date().toISOString()
          }))
        );

      if (catalogError) throw catalogError;

      // Mettre à jour le statut de synchronisation
      const { error: updateError } = await supabase
        .from('sync_history')
        .update({
          status: 'completed',
          items_processed: productIds.length,
          items_succeeded: productIds.length,
          completed_at: new Date().toISOString()
        })
        .eq('id', syncHistory.id);

      if (updateError) throw updateError;

      toast({
        title: "Synchronisation réussie",
        description: `${productIds.length} produits ont été synchronisés avec succès.`
      });
    } catch (error: any) {
      console.error('Erreur lors de la synchronisation:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Une erreur est survenue lors de la synchronisation du catalogue.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    syncCatalog
  };
};