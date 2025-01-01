import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, Book, HelpCircle, PlayCircle } from "lucide-react";

export default function Guides() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Guides et Ressources</h1>
          <p className="text-xl text-gray-600">Tout ce dont vous avez besoin pour réussir avec Sokoby</p>
        </div>

        {/* Section Vidéo */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8 mb-8">
            <div className="max-w-3xl mx-auto">
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center relative group cursor-pointer">
                  <img 
                    src="/placeholder.svg" 
                    alt="Thumbnail vidéo Sokoby" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                    <PlayCircle className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Découvrez Sokoby en action</h2>
              <p className="text-gray-600 mb-6">
                Apprenez comment créer votre boutique en ligne en quelques minutes avec notre IA et commencez à vendre immédiatement.
              </p>
            </div>
          </div>

          {/* Comparaison des prix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-red-500">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-600">Sokoby</CardTitle>
                <CardDescription>La solution la plus abordable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-3xl font-bold">19.99€ <span className="text-sm font-normal">/mois</span></p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">✓ Boutique IA intégrée</li>
                    <li className="flex items-center gap-2">✓ Dropshipping automatisé</li>
                    <li className="flex items-center gap-2">✓ Sans frais de transaction</li>
                    <li className="flex items-center gap-2">✓ Support 24/7</li>
                    <li className="flex items-center gap-2">✓ Domaine personnalisé</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shopify</CardTitle>
                <CardDescription>Solution standard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-3xl font-bold">29.99€ <span className="text-sm font-normal">/mois</span></p>
                  <ul className="space-y-2 text-gray-600">
                    <li>✗ Pas d'IA intégrée</li>
                    <li>✗ Dropshipping via apps payantes</li>
                    <li>✗ 2% frais de transaction</li>
                    <li>✓ Support email</li>
                    <li>✓ Domaine personnalisé</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Magento</CardTitle>
                <CardDescription>Solution entreprise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-3xl font-bold">À partir de 50€ <span className="text-sm font-normal">/mois</span></p>
                  <ul className="space-y-2 text-gray-600">
                    <li>✗ Configuration complexe</li>
                    <li>✗ Nécessite un développeur</li>
                    <li>✓ Pas de frais de transaction</li>
                    <li>✓ Support entreprise</li>
                    <li>✓ Hautement personnalisable</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Guide de démarrage */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-[#ea384c]" />
                Guide de démarrage
              </CardTitle>
              <CardDescription>
                Apprenez les bases pour bien démarrer avec Sokoby
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Configuration initiale de votre compte</li>
                <li>• Personnalisation de votre boutique</li>
                <li>• Ajout de vos premiers produits</li>
                <li>• Configuration des moyens de paiement</li>
              </ul>
            </CardContent>
          </Card>

          {/* Documentation technique */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-6 w-6 text-[#ea384c]" />
                Documentation technique
              </CardTitle>
              <CardDescription>
                Ressources techniques détaillées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• API et intégrations</li>
                <li>• Personnalisation avancée</li>
                <li>• Sécurité et performances</li>
                <li>• Meilleures pratiques</li>
              </ul>
            </CardContent>
          </Card>

          {/* FAQ et Support */}
          <Card className="hover:shadow-lg transition-shadow md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-[#ea384c]" />
                FAQ et Support
              </CardTitle>
              <CardDescription>
                Réponses aux questions fréquentes et support personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-600">
                  <li>• Questions fréquentes</li>
                  <li>• Résolution des problèmes</li>
                  <li>• Contact support</li>
                  <li>• Communauté d'entraide</li>
                </ul>
                <div className="flex flex-col items-start gap-4">
                  <p className="text-gray-600">Besoin d'aide supplémentaire ?</p>
                  <Button 
                    variant="default" 
                    className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Contactez notre support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}