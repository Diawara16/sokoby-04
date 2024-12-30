import React from "react";
import { Users, Target, History, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuiSommesNous() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Qui sommes-nous ?</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="bg-primary/10 p-4">
            <Target className="h-8 w-8 text-primary mb-2" />
            <h2 className="text-xl font-semibold mb-2">Notre Mission</h2>
            <p className="text-gray-600">
              Nous révolutionnons le commerce en ligne en rendant la création et la gestion de boutiques 
              accessibles à tous. Notre plateforme combine simplicité d'utilisation et technologies 
              avancées pour vous permettre de réussir dans l'e-commerce.
            </p>
          </div>
        </Card>

        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="bg-primary/10 p-4">
            <History className="h-8 w-8 text-primary mb-2" />
            <h2 className="text-xl font-semibold mb-2">Notre Histoire</h2>
            <p className="text-gray-600">
              Fondée par des passionnés du e-commerce, notre entreprise est née de la volonté 
              de démocratiser la vente en ligne. Depuis nos débuts, nous n'avons cessé d'innover 
              pour offrir les meilleures solutions à nos clients.
            </p>
          </div>
        </Card>

        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="bg-primary/10 p-4">
            <Heart className="h-8 w-8 text-primary mb-2" />
            <h2 className="text-xl font-semibold mb-2">Nos Valeurs</h2>
            <p className="text-gray-600">
              L'innovation, la simplicité et la satisfaction client sont au cœur de notre approche. 
              Nous croyons en un commerce en ligne éthique, accessible et performant pour tous 
              les entrepreneurs.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-12">
        <Card className="overflow-hidden">
          <div className="bg-primary/5 p-6">
            <h2 className="text-2xl font-semibold mb-4">Notre Équipe</h2>
            <p className="text-gray-600 mb-6">
              Notre équipe diversifiée combine expertise technique et connaissance approfondie 
              du e-commerce pour vous offrir la meilleure expérience possible. Nous sommes 
              dédiés à votre succès et travaillons constamment à améliorer nos services.
            </p>
            <Button className="bg-primary hover:bg-primary-600">
              Contactez-nous
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}