import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StoreSuccessPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAI?: boolean;
}

const steps = [
  "Conception du design...",
  "Ajout des produits...",
  "Optimisation du contenu...",
  "Finalisation de la configuration..."
];

export const StoreSuccessPopup = ({ open, onOpenChange, isAI = false }: StoreSuccessPopupProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (open && isAI) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [open, isAI]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-2xl shadow-xl p-0 border-0">
        <div className="p-8 text-center space-y-6">
          {/* Animated Icon */}
          <div className="flex justify-center">
            {isAI ? (
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl">⚙️</div>
              </div>
            ) : (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">✅</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {isAI ? "Votre boutique IA est en cours de génération !" : "Votre boutique a été créée avec succès !"}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {isAI ? (
                <>
                  Notre système crée votre boutique personnalisée avec l'IA.<br />
                  Ce processus prend généralement <strong>1–3 minutes</strong>.<br />
                  Vous pourrez tout gérer une fois la création terminée.
                </>
              ) : (
                <>
                  Votre boutique est prête à être utilisée.<br />
                  Vous pouvez maintenant la gérer depuis votre tableau de bord.
                </>
              )}
            </p>
          </div>

          {/* Progress Steps (AI only) */}
          {isAI && (
            <div className="text-sm text-gray-500 italic min-h-[24px] animate-pulse">
              {steps[currentStep]}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 w-full pt-2">
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate('/tableau-de-bord');
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl transition text-base font-medium"
            >
              Accéder au tableau de bord
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onOpenChange(false);
                navigate('/');
              }}
              className="w-full text-gray-500 hover:text-gray-700 transition text-sm"
            >
              Retourner à l'accueil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
