
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

export function MythBuster() {
  const myths = [
    {
      myth: "L'IA ne peut pas créer une boutique de qualité professionnelle",
      reality: "Notre IA génère des boutiques avec un design professionnel, un SEO optimisé et des produits soigneusement sélectionnés. Nos clients génèrent en moyenne €4,200/mois.",
      verdict: true
    },
    {
      myth: "Les boutiques IA sont toutes identiques",
      reality: "Chaque boutique est unique selon la niche choisie. L'IA adapte le design, les couleurs, les produits et le contenu spécifiquement à votre marché.",
      verdict: true
    },
    {
      myth: "Je ne peux pas modifier ma boutique après génération",
      reality: "Faux ! Une fois générée, vous avez accès à tous les outils Sokoby pour personnaliser, ajouter des produits et faire évoluer votre boutique.",
      verdict: true
    },
    {
      myth: "La création manuelle est toujours meilleure",
      reality: "Pas nécessairement. Nos boutiques IA performent souvent mieux car elles sont optimisées dès le départ avec des données de marché réelles.",
      verdict: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Mythes vs Réalité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {myths.map((item, index) => (
            <div key={index} className="border-l-4 border-l-primary/20 pl-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                  <X className="h-4 w-4 text-red-600" />
                </div>
                <div className="font-medium text-gray-900">{item.myth}</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-gray-700">{item.reality}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
