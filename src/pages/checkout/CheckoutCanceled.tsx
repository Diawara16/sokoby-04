import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";

export default function CheckoutCanceled() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Canceled Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-800 mb-2">
            Paiement annulé
          </h1>
          <p className="text-red-600">
            Votre commande n'a pas été finalisée
          </p>
        </div>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Que s'est-il passé ?</CardTitle>
            <CardDescription>
              Le processus de paiement a été interrompu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2"></div>
                <div>
                  <p className="font-medium">Paiement annulé</p>
                  <p className="text-sm text-muted-foreground">
                    Vous avez choisi d'annuler le processus de paiement
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                <div>
                  <p className="font-medium text-muted-foreground">Aucun débit</p>
                  <p className="text-sm text-muted-foreground">
                    Aucun montant n'a été prélevé sur votre compte
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                <div>
                  <p className="font-medium text-muted-foreground">Panier sauvegardé</p>
                  <p className="text-sm text-muted-foreground">
                    Vos articles sont toujours dans votre panier
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Besoin d'aide ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Problème technique :</strong> Si vous rencontrez des difficultés avec le paiement, 
                essayez de vider votre cache ou d'utiliser un autre navigateur.
              </p>
              <p>
                <strong>Méthode de paiement :</strong> Vérifiez que votre carte bancaire est valide 
                et qu'elle dispose de fonds suffisants.
              </p>
              <p>
                <strong>Sécurité :</strong> Assurez-vous que votre connexion internet est sécurisée 
                et que vous êtes sur le bon site.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/tableau-de-bord">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link to="/boutique-editeur?tab=products">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retour à la boutique
            </Link>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Problème persistant ? Contactez notre support à{" "}
            <a href="mailto:support@example.com" className="underline hover:text-primary">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}