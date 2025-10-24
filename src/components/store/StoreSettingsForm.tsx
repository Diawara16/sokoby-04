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
  "Finalisation de la configuration...",
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
      <DialogContent className="max-w-[340px] md:max-w-[400px] bg-white rounded-2xl shadow-xl p-6 border-0 mx-auto text-center">
        <div className="space-y-5">
          {/* Animated Icon */}
          <div className="flex justify-center">
            {isAI ? (
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-xl">⚙️</div>
              </div>
            ) : (
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {isAI ? "Votre boutique IA est en cours de génération !" : "Votre boutique a été créée avec succès !"}
            </h2>
            <p className="text-gray-600 text-xs leading-relaxed">
              {isAI ? (
                <>
                  Notre système crée votre boutique personnalisée avec l'IA.
                  <br />
                  Ce processus prend généralement <strong>1–3 minutes</strong>.
                </>
              ) : (
                <>Votre boutique est prête à être utilisée.</>
              )}
            </p>
          </div>

          {/* Progress Steps (AI only) */}
          {isAI && <div className="text-xs text-gray-500 italic animate-pulse">{steps[currentStep]}</div>}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate("/dashboard");
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium"
            >
              Tableau de bord
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onOpenChange(false);
                navigate("/");
              }}
              className="w-full text-gray-500 hover:text-gray-700 text-xs"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
