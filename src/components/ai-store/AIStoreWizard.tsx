import { useState } from "react";
import { NicheStep } from "./steps/NicheStep";
import { PreviewStep } from "./steps/PreviewStep";
import { PlanStep } from "./steps/PlanStep";
import { LaunchStep } from "./steps/LaunchStep";
import { GenerationProgress, GenerationError } from "./GenerationProgress";
import { useAIStoreGeneration } from "@/hooks/useAIStoreGeneration";

export type AIStoreData = {
  niche: string;
  storeName: string;
  slogan: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  products: AIProductPreview[];
};

export type AIProductPreview = {
  name: string;
  price: number;
  category: string;
  image?: string;
};

const NICHE_SUGGESTIONS = [
  { id: "fashion", label: "Mode & Vêtements", emoji: "👗", keywords: ["tendance", "style", "prêt-à-porter"] },
  { id: "electronics", label: "Électronique", emoji: "📱", keywords: ["tech", "gadgets", "accessoires"] },
  { id: "beauty", label: "Beauté & Soins", emoji: "💄", keywords: ["cosmétiques", "skincare", "bien-être"] },
  { id: "home", label: "Maison & Déco", emoji: "🏠", keywords: ["intérieur", "mobilier", "décoration"] },
  { id: "fitness", label: "Sport & Fitness", emoji: "💪", keywords: ["équipement", "nutrition", "entraînement"] },
  { id: "kids", label: "Enfants & Bébés", emoji: "👶", keywords: ["jouets", "vêtements", "éducatif"] },
];

function generateStorePreview(niche: string): AIStoreData {
  const nicheInfo = NICHE_SUGGESTIONS.find(n => n.id === niche) || { label: niche, emoji: "🏪" };
  const colors: Record<string, { primary: string; secondary: string; accent: string }> = {
    fashion: { primary: "#1a1a2e", secondary: "#f5f5f0", accent: "#e94560" },
    electronics: { primary: "#0f0f23", secondary: "#f0f4f8", accent: "#00d4ff" },
    beauty: { primary: "#2d132c", secondary: "#fff0f5", accent: "#ee6c9f" },
    home: { primary: "#1b4332", secondary: "#f8f6f0", accent: "#d4a574" },
    fitness: { primary: "#0d1b2a", secondary: "#f0f4f8", accent: "#ff6b35" },
    kids: { primary: "#2b2d42", secondary: "#fef9ef", accent: "#ffd166" },
  };
  const c = colors[niche] || colors.fashion;

  const productSets: Record<string, AIProductPreview[]> = {
    fashion: [
      { name: "Veste en cuir premium", price: 149.99, category: "Vestes" },
      { name: "Jean slim fit", price: 79.99, category: "Pantalons" },
      { name: "T-shirt coton bio", price: 34.99, category: "Hauts" },
      { name: "Sneakers urbaines", price: 119.99, category: "Chaussures" },
      { name: "Sac bandoulière", price: 89.99, category: "Accessoires" },
      { name: "Montre minimaliste", price: 199.99, category: "Accessoires" },
      { name: "Chemise en lin", price: 64.99, category: "Hauts" },
      { name: "Robe d'été", price: 54.99, category: "Robes" },
      { name: "Ceinture en cuir", price: 39.99, category: "Accessoires" },
      { name: "Lunettes de soleil", price: 49.99, category: "Accessoires" },
    ],
    electronics: [
      { name: "Écouteurs sans fil Pro", price: 129.99, category: "Audio" },
      { name: "Chargeur rapide 65W", price: 39.99, category: "Accessoires" },
      { name: "Coque smartphone premium", price: 29.99, category: "Protection" },
      { name: "Hub USB-C 7-en-1", price: 49.99, category: "Connectique" },
      { name: "Support laptop ergonomique", price: 59.99, category: "Bureau" },
      { name: "Webcam 4K", price: 89.99, category: "Vidéo" },
      { name: "Clavier mécanique", price: 109.99, category: "Périphériques" },
      { name: "Souris gaming", price: 69.99, category: "Périphériques" },
      { name: "Batterie externe 20000mAh", price: 44.99, category: "Énergie" },
      { name: "Ring light LED", price: 34.99, category: "Éclairage" },
    ],
    beauty: [
      { name: "Sérum vitamine C", price: 39.99, category: "Soins visage" },
      { name: "Crème hydratante", price: 29.99, category: "Soins visage" },
      { name: "Palette maquillage pro", price: 49.99, category: "Maquillage" },
      { name: "Huile capillaire", price: 24.99, category: "Cheveux" },
      { name: "Masque facial", price: 19.99, category: "Soins visage" },
      { name: "Rouge à lèvres mat", price: 22.99, category: "Maquillage" },
      { name: "Parfum signature", price: 79.99, category: "Parfum" },
      { name: "Kit manucure", price: 34.99, category: "Ongles" },
      { name: "Brosse nettoyante", price: 44.99, category: "Outils" },
      { name: "Baume à lèvres bio", price: 12.99, category: "Soins" },
    ],
    home: [
      { name: "Lampe design scandinave", price: 89.99, category: "Éclairage" },
      { name: "Coussin velours", price: 34.99, category: "Textile" },
      { name: "Vase artisanal", price: 49.99, category: "Décoration" },
      { name: "Bougie parfumée", price: 24.99, category: "Ambiance" },
      { name: "Miroir mural rond", price: 79.99, category: "Décoration" },
      { name: "Plaid en laine", price: 64.99, category: "Textile" },
      { name: "Cadre photo set", price: 29.99, category: "Décoration" },
      { name: "Organisateur bureau", price: 39.99, category: "Rangement" },
      { name: "Tapis berbère", price: 119.99, category: "Sols" },
      { name: "Horloge murale", price: 54.99, category: "Décoration" },
    ],
    fitness: [
      { name: "Bandes de résistance pro", price: 29.99, category: "Équipement" },
      { name: "Tapis yoga premium", price: 49.99, category: "Yoga" },
      { name: "Gourde isotherme 1L", price: 24.99, category: "Hydratation" },
      { name: "Haltères ajustables", price: 89.99, category: "Musculation" },
      { name: "Corde à sauter speed", price: 19.99, category: "Cardio" },
      { name: "Shaker protéines", price: 14.99, category: "Nutrition" },
      { name: "Gants de musculation", price: 22.99, category: "Accessoires" },
      { name: "Foam roller", price: 34.99, category: "Récupération" },
      { name: "Legging sport femme", price: 44.99, category: "Vêtements" },
      { name: "Montre fitness tracker", price: 69.99, category: "Tech" },
    ],
    kids: [
      { name: "Puzzle éducatif 100 pièces", price: 19.99, category: "Jouets" },
      { name: "Body coton bio bébé", price: 14.99, category: "Vêtements" },
      { name: "Peluche interactive", price: 29.99, category: "Jouets" },
      { name: "Set couverts bambou", price: 16.99, category: "Repas" },
      { name: "Livre sonore animaux", price: 12.99, category: "Éducatif" },
      { name: "Trottinette enfant", price: 59.99, category: "Mobilité" },
      { name: "Pyjama dinosaures", price: 22.99, category: "Vêtements" },
      { name: "Kit peinture créatif", price: 24.99, category: "Loisirs" },
      { name: "Veilleuse LED étoiles", price: 19.99, category: "Chambre" },
      { name: "Sac à dos école", price: 34.99, category: "Accessoires" },
    ],
  };

  return {
    niche,
    storeName: `${nicheInfo.label} by Sokoby`,
    slogan: `Votre destination ${nicheInfo.label.toLowerCase()} en ligne`,
    primaryColor: c.primary,
    secondaryColor: c.secondary,
    accentColor: c.accent,
    products: productSets[niche] || productSets.fashion,
  };
}

export function AIStoreWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [storeData, setStoreData] = useState<AIStoreData | null>(null);
  const { state: genState, generate, reset } = useAIStoreGeneration();

  const isGenerating = genState.isLocked || (genState.phase !== "idle" && genState.phase !== "complete" && genState.phase !== "error");

  const handleNicheSelect = (nicheId: string) => {
    const data = generateStorePreview(nicheId);
    setStoreData(data);
    setCurrentStep(1);
  };

  const handleCustomize = (updates: Partial<AIStoreData>) => {
    if (storeData) setStoreData({ ...storeData, ...updates });
  };

  const handleLaunch = async () => {
    if (!storeData || isGenerating) return;
    setCurrentStep(3);
    await generate(storeData);
  };

  const handleRetry = () => {
    reset();
    setCurrentStep(2);
  };

  const steps = [
    { title: "Niche", description: "Choisissez votre marché" },
    { title: "Aperçu", description: "Prévisualisez votre boutique" },
    { title: "Plan", description: "Produits & layout" },
    { title: "Lancement", description: "Votre boutique est prête" },
  ];

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i <= currentStep
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span className="text-xs mt-1 text-muted-foreground hidden sm:block">{step.title}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 transition-all ${i < currentStep ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      {currentStep === 0 && (
        <NicheStep niches={NICHE_SUGGESTIONS} onSelect={handleNicheSelect} />
      )}
      {currentStep === 1 && storeData && (
        <PreviewStep data={storeData} onCustomize={handleCustomize} onNext={() => setCurrentStep(2)} onBack={() => setCurrentStep(0)} />
      )}
      {currentStep === 2 && storeData && (
        <PlanStep data={storeData} onNext={handleLaunch} onBack={() => setCurrentStep(1)} isGenerating={isGenerating} />
      )}
      {currentStep === 3 && isGenerating && (
        <GenerationProgress
          phase={genState.phase}
          progress={genState.progress}
          message={genState.message}
          productsCreated={genState.productsCreated}
          totalProducts={genState.totalProducts}
        />
      )}
      {currentStep === 3 && genState.phase === "error" && (
        <GenerationError message={genState.error || "Erreur inconnue"} onRetry={handleRetry} />
      )}
      {currentStep === 3 && genState.phase === "complete" && storeData && (
        <LaunchStep data={storeData} productsCreated={genState.productsCreated} onBack={() => setCurrentStep(2)} />
      )}
    </div>
  );
}
