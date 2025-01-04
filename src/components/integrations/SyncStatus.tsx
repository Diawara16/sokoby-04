import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface SyncStatusProps {
  integrationId: string;
  productId: string;
}

export const SyncStatus = ({ integrationId, productId }: SyncStatusProps) => {
  const [status, setStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('social_catalog_items')
        .select('sync_status')
        .match({ integration_id: integrationId, product_id: productId })
        .single();

      if (!error && data) {
        setStatus(data.sync_status);
      }
      setLoading(false);
    };

    fetchStatus();

    // Écouter les mises à jour en temps réel
    const channel = supabase
      .channel('catalog-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'social_catalog_items',
          filter: `integration_id=eq.${integrationId}&product_id=eq.${productId}`
        },
        (payload) => {
          if (payload.new) {
            setStatus(payload.new.sync_status);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [integrationId, productId]);

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  return (
    <Badge variant={status === 'completed' ? 'success' : 'secondary'}>
      {status === 'completed' ? 'Synchronisé' : 'En attente'}
    </Badge>
  );
};