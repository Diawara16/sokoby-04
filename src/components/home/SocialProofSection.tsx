
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users, Globe } from "lucide-react";

export function SocialProofSection() {
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Fondatrice, Mode & Style",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      content: "J'ai migré de Shopify vers Sokoby et j'économise 400€/mois tout en ayant de meilleures fonctionnalités. L'IA m'a fait gagner un temps fou !",
      revenue: "+180% de CA",
      rating: 5
    },
    {
      name: "Thomas Martin",
      role: "CEO, Tech Gadgets",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      content: "Après 3 ans sur Shopify, le passage à Sokoby a été une révélation. Setup en 10 minutes, IA qui optimise tout, coûts divisés par 3.",
      revenue: "50k€/mois",
      rating: 5
    },
    {
      name: "Sophie Leclerc",
      role: "Artisane, Bio & Nature",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: "L'IA de Sokoby gère mes descriptions produits, mes prix et même mes campagnes marketing. Plus jamais Shopify avec ses coûts cachés !",
      revenue: "+250% ventes",
      rating: 5
    }
  ];

  const stats = [
    { icon: Users, value: "25 000+", label: "Entrepreneurs qui nous font confiance" },
    { icon: Globe, value: "120+", label: "Pays couverts" },
    { icon: TrendingUp, value: "€2.5M", label: "CA généré par nos clients ce mois" },
    { icon: Star, value: "4.9/5", label: "Note moyenne client" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            Témoignages clients
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ils ont quitté Shopify pour Sokoby
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez pourquoi nos clients ne reviendraient jamais en arrière
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-red-100 rounded-full">
                    <IconComponent className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {testimonial.revenue}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Migration CTA */}
        <div className="text-center mt-16 bg-gray-50 rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Vous utilisez actuellement Shopify ?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Notre équipe vous aide gratuitement à migrer votre boutique en moins de 24h, 
            sans perdre vos données ni interrompre vos ventes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-blue-100 text-blue-800 text-sm py-2 px-4">
              ✅ Migration gratuite
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 text-sm py-2 px-4">
              ✅ 0 interruption
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 text-sm py-2 px-4">
              ✅ Support dédié
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
