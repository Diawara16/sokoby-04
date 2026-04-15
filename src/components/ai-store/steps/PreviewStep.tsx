import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Palette, Type } from "lucide-react";
import type { AIStoreData } from "../AIStoreWizard";

interface PreviewStepProps {
  data: AIStoreData;
  onCustomize: (updates: Partial<AIStoreData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PreviewStep({ data, onCustomize, onNext, onBack }: PreviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Aperçu de votre boutique</h2>
        <p className="text-muted-foreground">Personnalisez l'identité visuelle</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customization panel */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2 text-foreground">
            <Type className="h-4 w-4" /> Identité
          </h3>
          <div className="space-y-3">
            <div>
              <Label>Nom de la boutique</Label>
              <Input value={data.storeName} onChange={(e) => onCustomize({ storeName: e.target.value })} />
            </div>
            <div>
              <Label>Slogan</Label>
              <Input value={data.slogan} onChange={(e) => onCustomize({ slogan: e.target.value })} />
            </div>
          </div>

          <h3 className="font-semibold flex items-center gap-2 text-foreground pt-2">
            <Palette className="h-4 w-4" /> Couleurs
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Principale", key: "primaryColor" as const },
              { label: "Secondaire", key: "secondaryColor" as const },
              { label: "Accent", key: "accentColor" as const },
            ].map(({ label, key }) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={data[key]}
                    onChange={(e) => onCustomize({ [key]: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Live preview */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 shadow-sm" style={{ backgroundColor: data.primaryColor }}>
            <h3 className="text-lg font-bold" style={{ color: data.accentColor }}>
              {data.storeName}
            </h3>
            <p className="text-sm mt-1 opacity-80" style={{ color: data.secondaryColor }}>
              {data.slogan}
            </p>
            <Button
              size="sm"
              className="mt-4 font-medium"
              style={{ backgroundColor: data.accentColor, color: data.primaryColor }}
            >
              Découvrir →
            </Button>
          </div>
          <div className="p-6 space-y-3" style={{ backgroundColor: data.secondaryColor }}>
            {data.products.slice(0, 3).map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border"
                style={{ borderColor: data.accentColor + "20" }}
              >
                <div>
                  <p className="font-medium text-sm" style={{ color: data.primaryColor }}>{p.name}</p>
                  <p className="text-xs opacity-60" style={{ color: data.primaryColor }}>{p.category}</p>
                </div>
                <span className="font-bold text-sm" style={{ color: data.accentColor }}>
                  {p.price.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        <Button onClick={onNext}>
          Continuer <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
