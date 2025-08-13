import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface BrandSettings {
  id: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  slogan: string | null;
}

export const useBrandSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchBrandSettings = async (): Promise<BrandSettings | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching brand settings:', error);
      return null;
    }
  };

  const updateBrandSettings = async (settings: Partial<BrandSettings>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('brand_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les paramètres de marque ont été mis à jour",
      });
    } catch (error) {
      console.error('Error updating brand settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres de marque",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('brand_assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('brand_assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le logo",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    isLoading,
    fetchBrandSettings,
    updateBrandSettings,
    uploadLogo,
  };
};