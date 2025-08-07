import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import { CreditCard, Shield, AlertCircle, Check } from "lucide-react";

export function StorePaymentSettings() {
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [stripePublicKey, setStripePublicKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [paypalClientId, setPaypalClientId] = useState("");
  
  const { isLoading, savePaymentSettings } = usePaymentSettings();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await savePaymentSettings({
        stripeEnabled,
        paypalEnabled,
        apiKeys: {
          stripePublicKey,
          stripeSecretKey,
          paypalClientId,
        }
      });
    } catch (error) {
      console.error('Error saving payment settings:', error);
    }
  };

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Cartes de crédit, Apple Pay, Google Pay',
      logo: '💳',
      enabled: stripeEnabled,
      onToggle: setStripeEnabled,
      status: 'available',
      fees: '2,9% + 0,30€'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'PayPal, cartes de crédit',
      logo: '💰',
      enabled: paypalEnabled,
      onToggle: setPaypalEnabled,
      status: 'available',
      fees: '3,4% + 0,35€'
    },
    {
      id: 'klarna',
      name: 'Klarna',
      description: 'Paiement en plusieurs fois',
      logo: '🛍️',
      enabled: false,
      onToggle: () => {},
      status: 'coming_soon',
      fees: '2,5%'
    },
    {
      id: 'crypto',
      name: 'Cryptomonnaies',
      description: 'Bitcoin, Ethereum, etc.',
      logo: '₿',
      enabled: false,
      onToggle: () => {},
      status: 'beta',
      fees: '1,5%'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'coming_soon':
        return <Badge variant="secondary">Bientôt</Badge>;
      case 'beta':
        return <Badge variant="outline">Bêta</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Méthodes de paiement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Méthodes de paiement
          </CardTitle>
          <CardDescription>
            Configurez les moyens de paiement acceptés dans votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{method.logo}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{method.name}</h4>
                      {getStatusBadge(method.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <p className="text-xs text-muted-foreground">Frais: {method.fees}</p>
                  </div>
                </div>
                <Switch
                  checked={method.enabled}
                  onCheckedChange={method.onToggle}
                  disabled={method.status !== 'available'}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Stripe */}
      {stripeEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Configuration Stripe
            </CardTitle>
            <CardDescription>
              Configurez votre compte Stripe pour accepter les paiements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                Vous devez créer un compte Stripe sur{" "}
                <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="underline">
                  stripe.com
                </a>{" "}
                pour obtenir vos clés API.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_public_key">Clé publique Stripe</Label>
              <Input
                id="stripe_public_key"
                type="text"
                placeholder="pk_test_..."
                value={stripePublicKey}
                onChange={(e) => setStripePublicKey(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_secret_key">Clé secrète Stripe</Label>
              <Input
                id="stripe_secret_key"
                type="password"
                placeholder="sk_test_..."
                value={stripeSecretKey}
                onChange={(e) => setStripeSecretKey(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration PayPal */}
      {paypalEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Configuration PayPal
            </CardTitle>
            <CardDescription>
              Configurez votre compte PayPal pour accepter les paiements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                Vous devez créer un compte développeur PayPal sur{" "}
                <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" className="underline">
                  developer.paypal.com
                </a>{" "}
                pour obtenir votre Client ID.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypal_client_id">Client ID PayPal</Label>
              <Input
                id="paypal_client_id"
                type="text"
                placeholder="YOUR_PAYPAL_CLIENT_ID"
                value={paypalClientId}
                onChange={(e) => setPaypalClientId(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité des paiements
          </CardTitle>
          <CardDescription>
            Informations sur la sécurité de votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Certificat SSL</p>
                <p className="text-sm text-muted-foreground">Chiffrement des données activé</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Conformité PCI DSS</p>
                <p className="text-sm text-muted-foreground">Norme de sécurité respectée</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Protection des données</p>
                <p className="text-sm text-muted-foreground">RGPD compliant</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Détection des fraudes</p>
                <p className="text-sm text-muted-foreground">Protection automatique</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto">
        {isLoading ? "Sauvegarde..." : "Sauvegarder les paramètres de paiement"}
      </Button>
    </div>
  );
}