import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function QuiSommesNous() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-8 w-8 text-red-600" />
        <h1 className="text-3xl font-bold">Qui sommes-nous ?</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Notre Mission</h2>
          <p className="text-gray-600">
            Nous aidons les entrepreneurs à créer et gérer leurs boutiques en ligne avec facilité. 
            Notre plateforme simplifie le commerce électronique pour tous.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Notre Histoire</h2>
          <p className="text-gray-600">
            Fondée par des passionnés du e-commerce, notre entreprise s'est développée 
            avec l'objectif de démocratiser la vente en ligne.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Nos Valeurs</h2>
          <p className="text-gray-600">
            Innovation, simplicité et satisfaction client sont au cœur de notre approche. 
            Nous croyons en un commerce en ligne accessible à tous.
          </p>
        </Card>
      </div>

      <div className="mt-12">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notre Équipe</h2>
          <p className="text-gray-600">
            Notre équipe diversifiée combine expertise technique et connaissance approfondie 
            du e-commerce pour vous offrir la meilleure expérience possible. Nous sommes 
            dédiés à votre succès et travaillons constamment à améliorer nos services.
          </p>
        </Card>
      </div>
    </div>
  );
}