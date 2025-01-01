import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Marie L.",
    role: "Créatrice de bijoux",
    content: "Grâce à Sokoby, j'ai pu créer ma boutique de bijoux artisanaux en quelques heures. L'IA a généré des descriptions parfaites pour mes créations.",
    rating: 5
  },
  {
    name: "Thomas R.",
    role: "Entrepreneur",
    content: "La simplicité de création et la qualité du design m'ont vraiment impressionné. Mon site de vêtements éco-responsables a été généré en un temps record.",
    rating: 5
  },
  {
    name: "Sophie M.",
    role: "Artiste digitale",
    content: "L'IA a parfaitement compris mon univers artistique. La boutique générée correspond exactement à mes attentes visuelles.",
    rating: 5
  }
];

export const StoreExamples = () => {
  return (
    <div className="space-y-16 py-12">
      {/* Section Exemples */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 font-heading">
            Exemples de boutiques créées
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez comment nos clients utilisent Sokoby pour créer des boutiques uniques et performantes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img 
                src="/lovable-uploads/0cf990b9-e838-4f20-9840-c9a568e27967.png" 
                alt="Exemple boutique mode" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <Badge className="absolute top-4 right-4 bg-primary/90">Mode</Badge>
          </div>
          <div className="relative group">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img 
                src="/placeholder.svg" 
                alt="Exemple boutique art" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <Badge className="absolute top-4 right-4 bg-primary/90">Art</Badge>
          </div>
          <div className="relative group">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img 
                src="/placeholder.svg" 
                alt="Exemple boutique bijoux" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <Badge className="absolute top-4 right-4 bg-primary/90">Bijoux</Badge>
          </div>
        </div>
      </div>

      {/* Section Témoignages */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 font-heading">
            Ce que disent nos clients
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les expériences de nos utilisateurs avec notre solution de création de boutique IA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-primary/20" />
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
              <div className="pt-4 border-t">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};