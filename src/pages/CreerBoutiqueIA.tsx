import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { CreationComplete } from "@/components/store-creator/CreationComplete";
import { useStoreCreation } from "@/hooks/useStoreCreation";
import { LoadingSpinner } from "@/components/pricing/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, Lock } from "lucide-react";

const CreerBoutiqueIA = () => {
  const {
    step,
    processStep,
    isLoading,
    progress,
    error,
    storeUrl,
    handleNicheSelect,
    handleComplete
  } = useStoreCreation();

  const [storeName, setStoreName] = useState("Ma boutique Sokoby");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const handleStoreCreation = async (niche: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('store_settings')
        .update({
          store_name: storeName,
          store_email: storeEmail || user.email,
          store_phone: storePhone,
          store_address: storeAddress
        })
        .eq('user_id', user.id);
    }
    
    handleNicheSelect(niche);
  };

  const renderStoreSettings = () => (
    <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Configuration IA
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Option Premium
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Notre IA va configurer automatiquement votre boutique en fonction de vos préférences
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="store_name">Nom de la boutique</Label>
          <Input
            id="store_name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Ma boutique Sokoby"
            className="border-primary/20"
          />
        </div>
        <div>
          <Label htmlFor="store_email">Email de contact</Label>
          <Input
            id="store_email"
            type="email"
            value={storeEmail}
            onChange={(e) => setStoreEmail(e.target.value)}
            placeholder="contact@maboutique.com"
            className="border-primary/20"
          />
        </div>
        <div>
          <Label htmlFor="store_phone">Téléphone</Label>
          <Input
            id="store_phone"
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
            placeholder="+33 1 23 45 67 89"
            className="border-primary/20"
          />
        </div>
        <div>
          <Label htmlFor="store_address">Adresse</Label>
          <Input
            id="store_address"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            placeholder="123 rue du Commerce, 75001 Paris"
            className="border-primary/20"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (isLoading && step === 'niche') {
      return <LoadingSpinner message="Initialisation..." />;
    }

    switch (step) {
      case 'progress':
        return <CreationProgress 
          progress={progress} 
          currentStep={processStep}
        />;
      case 'complete':
        return (
          <CreationComplete
            storeUrl={storeUrl || ''}
            productsCount={20}
            onComplete={handleComplete}
          />
        );
      default:
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                    <Bot className="h-5 w-5" />
                    <span className="font-medium">Boutique IA</span>
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 font-heading">
                  Créez votre boutique automatisée
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Notre IA va générer une boutique complète et optimisée pour votre niche, avec des produits pertinents et des descriptions détaillées.
                </p>
              </div>
              {renderStoreSettings()}
              <NicheSelector
                selectedNiche=""
                onSelectNiche={handleStoreCreation}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto">
        {error ? (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm" role="alert">
            <p className="font-medium">Une erreur est survenue</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;