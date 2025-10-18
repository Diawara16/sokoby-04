
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

// Produits de démonstration pour quand l'IA n'est pas disponible
const getDemoProducts = (niche: string) => {
  const demoProducts = {
    'Fitness': [
      { name: 'Bandes de résistance Pro', description: 'Set complet de bandes élastiques pour musculation', price: 29.99 },
      { name: 'Tapis de yoga premium', description: 'Tapis antidérapant 6mm d\'épaisseur', price: 39.99 },
      { name: 'Haltères ajustables', description: 'Paire d\'haltères 2-20kg modulables', price: 149.99 },
      { name: 'Corde à sauter fitness', description: 'Corde avec compteur intégré', price: 19.99 },
      { name: 'Kettlebell 12kg', description: 'Kettlebell en fonte avec revêtement', price: 49.99 }
    ],
    'Mode': [
      { name: 'T-shirt vintage', description: 'T-shirt coton bio coupe vintage', price: 24.99 },
      { name: 'Jean slim délavé', description: 'Jean coupe slim effet délavé', price: 79.99 },
      { name: 'Sneakers tendance', description: 'Baskets urbaines design moderne', price: 89.99 },
      { name: 'Veste bomber', description: 'Veste bomber unisexe style streetwear', price: 119.99 },
      { name: 'Casquette snapback', description: 'Casquette ajustable brodée', price: 29.99 }
    ],
    'Electronics': [
      { name: 'Écouteurs sans fil', description: 'Écouteurs Bluetooth haute qualité', price: 79.99 },
      { name: 'Chargeur rapide USB-C', description: 'Chargeur 65W compatible tous appareils', price: 34.99 },
      { name: 'Power bank 20000mAh', description: 'Batterie externe charge rapide', price: 49.99 },
      { name: 'Câble USB-C renforcé', description: 'Câble 2m avec gaine métallique', price: 19.99 },
      { name: 'Support téléphone bureau', description: 'Support ajustable multiangles', price: 24.99 }
    ]
  };
  
  return demoProducts[niche as keyof typeof demoProducts] || demoProducts['Electronics'];
};

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

      // Étape 4: Génération des produits (avec fallback démo)
      updateProgress(60, 'products');
      console.log("Génération des produits...");
      
      let productsGenerated = false;
      
      try {
        // Tentative avec l'IA OpenAI
        console.log("Tentative de génération avec OpenAI...");
        const { data, error } = await supabase.functions.invoke('generate-store', {
          body: {
            niche: nicheName,
            storeId: storeData.id,
            userId: user.id,
          },
        });

        if (error) {
          console.warn("Erreur OpenAI, passage en mode démo:", error);
          throw new Error('OpenAI indisponible');
        }

        console.log("Produits générés par l'IA:", data);
        productsGenerated = true;
        
      } catch (aiError) {
        console.log("IA indisponible, utilisation des produits de démonstration...");
        
        // Mode démonstration avec des produits prédéfinis
        const demoProducts = getDemoProducts(nicheName);
        const productsToInsert = demoProducts.map(product => ({
          ...product,
          niche: nicheName,
          image_url: null,
          user_id: user.id,
          store_id: storeData.id,
          supplier: 'Démonstration',
          status: 'demo'
        }));

        const { error: demoError } = await supabase
          .from('ai_generated_products')
          .insert(productsToInsert);

        if (demoError) {
          console.error("Erreur lors de l'insertion des produits démo:", demoError);
          throw new Error(`Erreur lors de la création des produits: ${demoError.message}`);
        }

        console.log("Produits de démonstration ajoutés");
        productsGenerated = true;
      }

      // Étape 5: Vérifier et appliquer le thème si nécessaire
      updateProgress(80, 'finalizing');
      try {
        // Check if brand settings already exist (including logo_url, colors, slogan)
        const { data: existingBrand } = await supabase
          .from('brand_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        // Only create default brand settings if none exist
        // This preserves existing logo_url, slogan, and colors across all stores
        if (!existingBrand) {
          const { error: themeError } = await supabase
            .from('brand_settings')
            .insert({
              user_id: user.id,
              primary_color: '#8B5CF6',
              secondary_color: '#D6BCFA'
            });

          if (themeError) {
            console.warn("Erreur lors de l'application du thème:", themeError);
          }
          console.log("Created new brand settings with default theme");
        } else {
          console.log("Brand settings already exist - preserving logo_url, colors, and slogan:", {
            logo: existingBrand.logo_url,
            primary: existingBrand.primary_color,
            secondary: existingBrand.secondary_color,
            slogan: existingBrand.slogan
          });
        }
      } catch (themeError) {
        console.warn("Impossible d'appliquer le thème premium");
      }

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
    navigate('/store-editor');
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
