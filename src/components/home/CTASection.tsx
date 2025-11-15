import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Shield, Zap, Sparkles } from "lucide-react";
import { T } from "@/components/translation/T";

export function CTASection() {

  return (
    <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px]" />
      <div className="container mx-auto px-4 text-center relative">
        <Badge className="mb-6 bg-white/20 text-white hover:bg-white/20 text-lg py-2 px-6">
          🚀 <T>Offre de lancement limitée</T>
        </Badge>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          <T>Créez votre empire e-commerce</T><br />
          <span className="text-red-200"><T>dès aujourd'hui</T></span>
        </h2>
        
        <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
          <T>Rejoignez les 25 000+ entrepreneurs qui ont choisi Sokoby plutôt que Shopify et économisent en moyenne 4 320€ par an</T>
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center text-white">
            <Clock className="h-6 w-6 mr-2" />
            <T>Création en 10 minutes</T>
          </div>
          <div className="flex items-center text-white">
            <Shield className="h-6 w-6 mr-2" />
            <T>14 jours gratuits</T>
          </div>
          <div className="flex items-center text-white">
            <Zap className="h-6 w-6 mr-2" />
            <T>IA incluse</T>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-white">
            Section sous construction - Nouvelle interface à venir
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">25 000+</div>
            <div className="text-red-200">
              <T>Boutiques créées</T>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-red-200">
              <T>Satisfaction client</T>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">€2.5M</div>
            <div className="text-red-200">
              <T>CA généré ce mois</T>
            </div>
          </div>
        </div>

        <p className="text-red-200 text-sm mt-8">
          ✅ <T>Paiement sécurisé</T> • ✅ <T>Support 24/7 inclus</T> • ✅ <T>Boutique générée par IA</T>
        </p>
      </div>
    </section>
  );
}
