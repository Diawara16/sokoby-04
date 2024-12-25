import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Apple, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const EssaiGratuit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Commencez votre essai gratuit
          </h1>
          <p className="text-gray-500">
            Obtenez 3 jours gratuits, puis 1 mois pour 1 $
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-center gap-2"
            onClick={() => {/* TODO: Implement email signup */}}
          >
            <Mail className="h-5 w-5" />
            Inscrivez-vous par e-mail
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-center gap-2"
            onClick={() => {/* TODO: Implement Google signup */}}
          >
            <FcGoogle className="h-5 w-5" />
            S'inscrire avec Google
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-center gap-2"
            onClick={() => {/* TODO: Implement Apple signup */}}
          >
            <Apple className="h-5 w-5" />
            S'inscrire avec Apple
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-center gap-2"
            onClick={() => {/* TODO: Implement Facebook signup */}}
          >
            <Facebook className="h-5 w-5 text-blue-600" />
            S'inscrire avec Facebook
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">ou</span>
          </div>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Vous avez déjà un compte ? </span>
          <Button 
            variant="link" 
            className="p-0 text-blue-600 hover:text-blue-800"
            onClick={() => {/* TODO: Implement login */}}
          >
            S'identifier
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500">
          En continuant, vous acceptez les{' '}
          <Button variant="link" className="p-0 text-blue-600 hover:text-blue-800 text-xs h-auto">
            conditions générales
          </Button>{' '}
          et la{' '}
          <Button variant="link" className="p-0 text-blue-600 hover:text-blue-800 text-xs h-auto">
            politique de confidentialité
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EssaiGratuit;