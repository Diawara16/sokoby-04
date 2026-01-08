
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type CreationStep = 'niche' | 'progress' | 'complete';
type ProcessStep = 'init' | 'products' | 'store' | 'finalizing';

async function generateUniqueDomainName(userId: string, nicheName: string) {
  const cleanNiche = nicheName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${cleanNiche}-${randomSuffix}`;
}

// Demo products disabled - all stores are LIVE production stores with real products only

export const useStoreCreation = () => {
  const [step, setStep] = useState<CreationStep>('niche');
  const [processStep, setProcessStep] = useState<ProcessStep>('init');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateProgress = (newProgress: number, newStep: ProcessStep) => {
    setProgress(newProgress);
    setProcessStep(newStep);
  };

  const handleNicheSelect = async (nicheName: string) => {
    console.log("Début de handleNicheSelect avec niche:", nicheName);
    
    try {
      setIsLoading(true);
      setError(null);
      setStep('progress');
      
      // Étape 1: Vérification de l'authentification
      updateProgress(10, 'init');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Erreur d'authentification:", authError);
        throw new Error("Erreur d'authentification. Veuillez vous reconnecter.");
      }
      
      if (!user) {
        throw new Error("Vous devez être connecté pour créer une boutique");
      }

      console.log("Utilisateur authentifié:", user.id);

      // Étape 2: Génération du nom de domaine
      updateProgress(25, 'init');
      const uniqueDomainName = await generateUniqueDomainName(user.id, nicheName);
      console.log("Nom de domaine généré:", uniqueDomainName);

      // Étape 3: Configuration des paramètres de la boutique
      updateProgress(40, 'store');
      console.log("Configuration des paramètres de la boutique...");
      
      const { data: existingSettings, error: checkError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error("Erreur lors de la vérification des paramètres:", checkError);
        throw new Error(`Erreur base de données: ${checkError.message}`);
      }

      let storeData;
      
      if (existingSettings) {
        console.log("Mise à jour des paramètres existants...");
        const { data: updatedData, error: updateError } = await supabase
          .from('store_settings')
          .update({
            domain_name: uniqueDomainName,
            store_name: `${nicheName} Store`,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) {
          console.error("Erreur lors de la mise à jour:", updateError);
          throw new Error(`Erreur lors de la mise à jour: ${updateError.message}`);
        }
        
        storeData = updatedData;
      } else {
        console.log("Création de nouveaux paramètres...");
        const { data: newData, error: insertError } = await supabase
          .from('store_settings')
          .insert({
            user_id: user.id,
            domain_name: uniqueDomainName,
            store_name: `${nicheName} Store`,
            store_email: user.email,
            store_description: `Boutique spécialisée en ${nicheName}`
          })
          .select()
          .single();

        if (insertError) {
          console.error("Erreur lors de la création:", insertError);
          throw new Error(`Erreur lors de la création: ${insertError.message}`);
        }
        
        storeData = newData;
      }

      console.log("Paramètres de boutique configurés:", storeData);

      // Étape 4: Load real products only (no demo products for LIVE stores)
      updateProgress(60, 'products');
      console.log("Loading real products for LIVE store...");
      
      let productsGenerated = false;
      
      // For LIVE stores, only load existing real products from products table
      const { data: existingProducts, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .eq('is_visible', true)
        .limit(1);
      
      if (!productsError && existingProducts && existingProducts.length > 0) {
        console.log("Real products found for LIVE store");
        productsGenerated = true;
      } else {
        console.log("No products found - LIVE store requires real products to be added via dashboard");
      }

      // Étape 5: Vérifier et appliquer le thème si nécessaire
      updateProgress(80, 'finalizing');
      let brandSettings = null;
      try {
        // Check if brand settings already exist (including logo_url, colors, slogan)
        // Order by created_at to get the most recent record in case of duplicates
        const { data: existingBrand } = await supabase
          .from('brand_settings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Only create default brand settings if none exist
        // This preserves existing logo_url, slogan, and colors across all stores
        if (!existingBrand) {
          const { data: newBrand, error: themeError } = await supabase
            .from('brand_settings')
            .insert({
              user_id: user.id,
              primary_color: '#8B5CF6',
              secondary_color: '#D6BCFA'
            })
            .select()
            .single();

          if (themeError) {
            console.warn("Erreur lors de l'application du thème:", themeError);
          } else {
            console.log("Created new brand settings with default theme (logo_url can be added later)");
            brandSettings = newBrand;
          }
        } else {
          brandSettings = existingBrand;
          // Explicitly verify that logo_url exists and is preserved
          console.log("✓ Brand settings found - ALL fields preserved for new store:", {
            logo_url: existingBrand.logo_url || '(not set)',
            primary_color: existingBrand.primary_color,
            secondary_color: existingBrand.secondary_color,
            slogan: existingBrand.slogan || '(not set)'
          });
          
          if (!existingBrand.logo_url) {
            console.warn("⚠️ Brand settings exist but logo_url is not set. Upload a logo in Store Editor to persist it across all stores.");
          } else {
            console.log("✅ Logo URL confirmed for new store:", existingBrand.logo_url);
          }
        }
      } catch (themeError) {
        console.warn("Impossible d'appliquer le thème premium");
      }

      // Explicitly fetch brand settings again to ensure latest data
      const { data: finalBrandSettings } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (finalBrandSettings?.logo_url) {
        console.log('✅ Final verification: Logo URL ready for new store:', finalBrandSettings.logo_url);
      } else {
        console.warn('⚠️ Final verification: No logo_url found in brand_settings');
      }

      // Trigger logo refresh with brand settings data
      window.dispatchEvent(new CustomEvent('logo-updated', { 
        detail: finalBrandSettings 
      }));
      console.log('✓ Logo refresh triggered for new store with brand data');

      // Étape 6: Création de la notification
      try {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Boutique créée avec succès',
            content: `Votre boutique "${nicheName}" a été créée avec des produits ${productsGenerated ? 'générés automatiquement' : 'de démonstration'}.`,
            read: false
          });

        if (notificationError) {
          console.warn("Erreur lors de la création de la notification:", notificationError);
        }
      } catch (notifError) {
        console.warn("Impossible de créer la notification");
      }

      // Étape 7: Finalisation
      updateProgress(100, 'finalizing');
      setStoreUrl(`https://${uniqueDomainName}.sokoby.com`);
      setStep('complete');

      toast({
        title: "Boutique créée avec succès",
        description: `Votre boutique "${nicheName}" est prête à être utilisée !`,
      });

    } catch (error: any) {
      console.error('Erreur lors de la création de la boutique:', error);
      const errorMessage = error.message || "Une erreur inattendue s'est produite";
      setError(errorMessage);
      setStep('niche');
      
      toast({
        title: "Erreur de création",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    // LIVE stores: redirect directly to storefront, not editor
    navigate('/boutique');
  };

  return {
    step,
    processStep,
    isLoading,
    progress,
    error,
    storeUrl,
    handleNicheSelect,
    handleComplete,
  };
};
