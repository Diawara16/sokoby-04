import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle, Store, Palette, ShoppingBag, UserCheck } from "lucide-react";

interface GenerationProgressProps {
  phase: string;
  progress: number;
  message: string;
  productsCreated: number;
  totalProducts: number;
}

const PHASES = [
  { key: "auth", label: "Authentification", icon: UserCheck },
  { key: "store", label: "Création boutique", icon: Store },
  { key: "branding", label: "Branding", icon: Palette },
  { key: "products", label: "Produits", icon: ShoppingBag },
];

export function GenerationProgress({ phase, progress, message, productsCreated, totalProducts }: GenerationProgressProps) {
  const phaseOrder = PHASES.map((p) => p.key);
  const currentIdx = phaseOrder.indexOf(phase);

  return (
    <div className="max-w-lg mx-auto space-y-6 py-8">
      <div className="text-center space-y-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Génération en cours…</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center text-sm text-muted-foreground">{progress}%</p>

      {/* Phase checklist */}
      <Card className="p-5 space-y-3">
        {PHASES.map((p, i) => {
          const done = i < currentIdx || phase === "complete";
          const active = i === currentIdx;
          const Icon = p.icon;
          return (
            <div key={p.key} className="flex items-center gap-3">
              {done ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : active ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-muted shrink-0" />
              )}
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className={`text-sm ${done ? "text-foreground" : active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {p.label}
                {p.key === "products" && active && totalProducts > 0 && (
                  <span className="ml-1 text-xs text-muted-foreground">({productsCreated}/{totalProducts})</span>
                )}
              </span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

export function GenerationError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-lg mx-auto text-center space-y-4 py-8">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
      <h2 className="text-xl font-bold text-foreground">Une erreur est survenue</h2>
      <p className="text-muted-foreground">{message}</p>
      <p className="text-sm text-muted-foreground">
        Votre boutique est peut-être déjà créée. Certains éléments peuvent être complétés manuellement.
      </p>
      <div className="flex gap-3 justify-center">
        <a href="/boutique" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Voir ma boutique
        </a>
        <button onClick={onRetry} className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium">
          Réessayer
        </button>
      </div>
    </div>
  );
}
