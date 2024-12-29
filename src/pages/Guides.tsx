import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, Book, HelpCircle } from "lucide-react";

export default function Guides() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Guides et Ressources</h1>
          <p className="text-xl text-gray-600">Tout ce dont vous avez besoin pour réussir avec Sokoby</p>
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

          {/* Tutoriels vidéo */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-6 w-6 text-[#ea384c]" />
                Tutoriels vidéo
              </CardTitle>
              <CardDescription>
                Découvrez nos tutoriels vidéo pas à pas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Présentation de l'interface</li>
                <li>• Gestion des commandes</li>
                <li>• Marketing et promotion</li>
                <li>• Analyse des performances</li>
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
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-[#ea384c]" />
                FAQ et Support
              </CardTitle>
              <CardDescription>
                Réponses aux questions fréquentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Questions fréquentes</li>
                <li>• Résolution des problèmes</li>
                <li>• Contact support</li>
                <li>• Communauté d'entraide</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">Besoin d'aide supplémentaire ?</p>
          <Button 
            variant="default" 
            className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
            onClick={() => window.location.href = '/contact'}
          >
            Contactez notre support
          </Button>
        </div>
      </div>
    </div>
  );
}