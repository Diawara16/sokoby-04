import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useCatalogSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const syncCatalog = async (integrationId: string, productIds: string[]) => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('tiktok-catalog-sync', {
        body: {
          integration_id: integrationId,
          product_ids: productIds
        }
      });

      if (error) throw error;

      toast({
        title: "Synchronisation réussie",
        description: `${productIds.length} produits ont été synchronisés avec TikTok Shop.`
      });

      return data;
    } catch (error: any) {
      console.error('Erreur lors de la synchronisation:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Une erreur est survenue lors de la synchronisation avec TikTok Shop.",
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