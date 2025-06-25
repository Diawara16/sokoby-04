
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users, Globe } from "lucide-react";
import { T } from "@/components/translation/T";
import { TTestimonial } from "@/components/translation/TTestimonial";
import { testimonials, stats } from "@/data/translatable";
import { useDeepLTranslation } from "@/hooks/useDeepLTranslation";

export function SocialProofSection() {
  const iconMap = {
    Users,
    Globe,
    TrendingUp,
    Star,
  } as const;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            <T>Témoignages clients</T>
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            <T>Ils ont quitté Shopify pour Sokoby</T>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <T>Découvrez pourquoi nos clients ne reviendraient jamais en arrière</T>
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <StatCard key={stat.id} stat={stat} IconComponent={IconComponent} />
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Migration CTA */}
        <div className="text-center mt-16 bg-gray-50 rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            <T>Vous utilisez actuellement Shopify ?</T>
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            <T>Notre équipe vous aide gratuitement à migrer votre boutique en moins de 24h, sans perdre vos données ni interrompre vos ventes.</T>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-blue-100 text-blue-800 text-sm py-2 px-4">
              <T>✅ Migration gratuite</T>
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 text-sm py-2 px-4">
              <T>✅ 0 interruption</T>
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 text-sm py-2 px-4">
              <T>✅ Support dédié</T>
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, IconComponent }: { stat: any; IconComponent: React.ComponentType<any> }) {
  const { translatedText } = useDeepLTranslation(stat.label, { fallback: stat.label });
  
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-red-100 rounded-full">
          <IconComponent className="h-8 w-8 text-red-600" />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
      <div className="text-gray-600">{translatedText}</div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  const { translatedText: translatedRevenue } = useDeepLTranslation(testimonial.revenue || '', { 
    fallback: testimonial.revenue || '' 
  });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
          ))}
        </div>
        
        <TTestimonial
          name={testimonial.name}
          role={testimonial.role}
          content={testimonial.content}
          className="mb-6"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">{testimonial.name}</div>
              <div className="text-sm text-gray-500">{testimonial.role}</div>
            </div>
          </div>
          {testimonial.revenue && (
            <Badge className="bg-green-100 text-green-800">
              {translatedRevenue}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
