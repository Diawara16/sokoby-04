import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ManualStoreDialog } from "./ManualStoreDialog";
import { AIStoreDialog } from "./AIStoreDialog";
import { StoreSuccessPopup } from "./StoreSuccessPopup";
import { Sparkles, Store } from "lucide-react";

interface StoreCreationButtonsProps {
  variant?: "hero" | "cta" | "card";
}

export const StoreCreationButtons = ({ variant = "hero" }: StoreCreationButtonsProps) => {
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [isAIStore, setIsAIStore] = useState(false);

  const handleManualSuccess = () => {
    setIsAIStore(false);
    setSuccessPopupOpen(true);
  };

  const handleAICheckout = (plan: string) => {
    // Will be handled by AIStoreDialog
  };

  if (variant === "card") {
    return (
      <>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="w-full h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => setManualDialogOpen(true)}
          >
            <Store className="h-5 w-5" />
            <div className="text-center">
              <div className="font-medium">Création manuelle</div>
              <div className="text-xs text-muted-foreground">Gratuit • Configuration étape par étape</div>
            </div>
          </Button>

          <Button
            className="w-full h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => setAIDialogOpen(true)}
          >
            <Sparkles className="h-5 w-5" />
            <div className="text-center">
              <div className="font-medium">Création avec IA</div>
              <div className="text-xs text-primary-foreground/80">Payant • Génération automatique</div>
            </div>
          </Button>
        </div>

        <ManualStoreDialog
          open={manualDialogOpen}
          onOpenChange={setManualDialogOpen}
          onSuccess={handleManualSuccess}
        />
        <AIStoreDialog
          open={aiDialogOpen}
          onOpenChange={setAIDialogOpen}
          onCheckout={handleAICheckout}
        />
        <StoreSuccessPopup
          open={successPopupOpen}
          onOpenChange={setSuccessPopupOpen}
          isAI={isAIStore}
        />
      </>
    );
  }

  if (variant === "cta") {
    return (
      <>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-4 font-semibold"
            onClick={() => setManualDialogOpen(true)}
          >
            🆓 Créer ma boutique gratuitement
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-4"
            onClick={() => setAIDialogOpen(true)}
          >
            ✨ Boutique IA (Payant)
          </Button>
        </div>

        <ManualStoreDialog
          open={manualDialogOpen}
          onOpenChange={setManualDialogOpen}
          onSuccess={handleManualSuccess}
        />
        <AIStoreDialog
          open={aiDialogOpen}
          onOpenChange={setAIDialogOpen}
          onCheckout={handleAICheckout}
        />
        <StoreSuccessPopup
          open={successPopupOpen}
          onOpenChange={setSuccessPopupOpen}
          isAI={isAIStore}
        />
      </>
    );
  }

  // Default hero variant
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          size="lg"
          className="flex-1 bg-white hover:bg-white/90 text-black font-medium text-lg py-6"
          onClick={() => setManualDialogOpen(true)}
        >
          🆓 Gratuit
        </Button>
        <Button
          size="lg"
          className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium text-lg py-6"
          onClick={() => setAIDialogOpen(true)}
        >
          ✨ IA (Payant)
        </Button>
      </div>

      <ManualStoreDialog
        open={manualDialogOpen}
        onOpenChange={setManualDialogOpen}
        onSuccess={handleManualSuccess}
      />
      <AIStoreDialog
        open={aiDialogOpen}
        onOpenChange={setAIDialogOpen}
        onCheckout={handleAICheckout}
      />
      <StoreSuccessPopup
        open={successPopupOpen}
        onOpenChange={setSuccessPopupOpen}
        isAI={isAIStore}
      />
    </>
  );
};
