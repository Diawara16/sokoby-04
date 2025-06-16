
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  storeType: string;
  revenue?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Marie Dubois",
    role: "Créatrice bijoux",
    avatar: "/placeholder.svg",
    rating: 5,
    comment: "Ma boutique de bijoux a été créée en 10 minutes avec 30 produits parfaitement optimisés. J'ai fait mes premières ventes dès la première semaine !",
    storeType: "Niche - Bijoux",
    revenue: "€2,400/mois"
  },
  {
    name: "Thomas Martin",
    role: "Entrepreneur",
    avatar: "/placeholder.svg",
    rating: 5,
    comment: "La boutique générale IA m'a donné 100+ produits dans différentes catégories. Le SEO était déjà optimisé, j'ai juste eu à promouvoir !",
    storeType: "Générale - Multi-catégories",
    revenue: "€5,800/mois"
  },
  {
    name: "Sophie Chen",
    role: "Designer",
    avatar: "/placeholder.svg",
    rating: 5,
    comment: "Impressionnant ! L'IA a choisi des produits de décoration parfaitement cohérents avec une identité visuelle pro. Économie de temps énorme.",
    storeType: "Niche - Décoration",
    revenue: "€3,200/mois"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Ils ont choisi la Boutique IA
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez comment nos clients ont lancé leur business en quelques minutes
            avec notre service de génération automatique.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header with Avatar and Info */}
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-4">
                  <Quote className="h-6 w-6 text-primary/20 absolute -top-2 -left-2" />
                  <p className="text-gray-700 italic pl-4">
                    "{testimonial.comment}"
                  </p>
                </div>

                {/* Store Details */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type de boutique :</span>
                    <span className="font-medium">{testimonial.storeType}</span>
                  </div>
                  {testimonial.revenue && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">CA mensuel :</span>
                      <span className="font-bold text-green-600">{testimonial.revenue}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stats */}
        <div className="mt-16 bg-primary/5 rounded-xl p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-gray-600">Boutiques IA créées</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">8 min</div>
              <div className="text-sm text-gray-600">Temps moyen de génération</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">94%</div>
              <div className="text-sm text-gray-600">Taux de satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">€4,2k</div>
              <div className="text-sm text-gray-600">CA moyen mensuel</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
