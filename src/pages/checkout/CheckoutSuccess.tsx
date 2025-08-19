import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Clock, ArrowLeft } from "lucide-react";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // In a real app, you'd verify the session with Stripe
      // For now, we'll show a success message
      setOrderDetails({
        id: sessionId.slice(-8),
        total: 49.99,
        status: 'processing',
        items: [
          { name: 'Produit exemple', quantity: 1, price: 49.99 }
        ],
        estimatedDelivery: '3-5 jours ouvrés'
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Paiement réussi !
          </h1>
          <p className="text-green-600">
            Votre commande a été confirmée et est en cours de traitement
          </p>
        </div>

        {/* Order Summary */}
        {orderDetails && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Commande #{orderDetails.id}
              </CardTitle>
              <CardDescription>
                Récapitulatif de votre commande
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Statut</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3 mr-1" />
                  En traitement
                </Badge>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Articles commandés</h4>
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{item.price.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{orderDetails.total.toFixed(2)}€</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span>Livraison estimée</span>
                  <span className="font-medium">{orderDetails.estimatedDelivery}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">1</span>
              </div>
              <div>
                <p className="font-medium">Confirmation par email</p>
                <p className="text-sm text-muted-foreground">
                  Un email de confirmation vous sera envoyé dans les prochaines minutes
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">2</span>
              </div>
              <div>
                <p className="font-medium">Préparation de la commande</p>
                <p className="text-sm text-muted-foreground">
                  Votre commande va être préparée et expédiée sous 24-48h
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-gray-400">3</span>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Suivi de livraison</p>
                <p className="text-sm text-muted-foreground">
                  Vous recevrez un numéro de suivi pour suivre votre colis
                </p>
              </div>
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
            <Link to="/orders">
              Voir mes commandes
            </Link>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Des questions ? Contactez notre support client à{" "}
            <a href="mailto:support@example.com" className="underline hover:text-primary">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}