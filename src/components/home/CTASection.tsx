
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface CTASectionProps {
  currentLanguage: string;
  onCreateStore: () => void;
}

export function CTASection({ currentLanguage, onCreateStore }: CTASectionProps) {
  return (
    <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px]" />
      <div className="container mx-auto px-4 text-center relative">
        <Badge className="mb-6 bg-white/20 text-white hover:bg-white/20 text-lg py-2 px-6">
          🚀 Offre de lancement limitée
        </Badge>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Créez votre empire e-commerce<br />
          <span className="text-red-200">dès aujourd'hui</span>
        </h2>
        
        <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
          Rejoignez les 25 000+ entrepreneurs qui ont choisi Sokoby plutôt que Shopify 
          et économisent en moyenne 4 320€ par an
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center text-white">
            <Clock className="h-6 w-6 mr-2" />
            <span>Création en 10 minutes</span>
          </div>
          <div className="flex items-center text-white">
            <Shield className="h-6 w-6 mr-2" />
            <span>14 jours gratuits</span>
          </div>
          <div className="flex items-center text-white">
            <Zap className="h-6 w-6 mr-2" />
            <span>IA incluse</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link to="/plan-tarifaire">
            <Button 
              size="lg" 
              className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-4 font-semibold"
            >
              🎯 Créer ma boutique gratuitement
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-4"
          >
            📞 Démo personnalisée
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">25 000+</div>
            <div className="text-red-200">Boutiques créées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-red-200">Satisfaction client</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">€2.5M</div>
            <div className="text-red-200">CA généré ce mois</div>
          </div>
        </div>

        <p className="text-red-200 text-sm mt-8">
          ✅ Aucune carte bancaire requise • ✅ Support 24/7 inclus • ✅ Migration Shopify gratuite
        </p>
      </div>
    </section>
  );
}
