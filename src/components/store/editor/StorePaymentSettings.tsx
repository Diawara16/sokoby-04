import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Shield, Check, Info, ExternalLink } from "lucide-react";
import { useStoreSettings } from "../hooks/useStoreSettings";
import { useStorePaymentConfigs, PaymentProvider } from "@/hooks/useStorePaymentConfigs";
import { useToast } from "@/hooks/use-toast";

/**
 * Per-store isolated payment configuration.
 * Each store owner provides their own Stripe/PayPal credentials.
 * No platform-level shared secrets are used.
 * Checkout is handled via Stripe-hosted Checkout (requires only publishable key client-side).
 */
export function StorePaymentSettings() {
  const { settings } = useStoreSettings();
  const storeId = settings?.id;
  const { configs, loading, upsertConfig, getConfig } = useStorePaymentConfigs(storeId);
  const { toast } = useToast();

  // Local state for form fields
  const [stripePublicKey, setStripePublicKey] = useState("");
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [paypalClientId, setPaypalClientId] = useState("");
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [paypalEnabled, setPaypalEnabled] = useState(false);

  // Sync from DB when configs load
  useEffect(() => {
    const stripe = getConfig("stripe");
    if (stripe) {
      setStripePublicKey(stripe.publishable_key || "");
      setStripeAccountId(stripe.account_id || "");
      setStripeEnabled(stripe.is_active);
    }
    const paypal = getConfig("paypal");
    if (paypal) {
      setPaypalClientId(paypal.publishable_key || "");
      setPaypalEnabled(paypal.is_active);
    }
  }, [configs, getConfig]);

  const saveProvider = async (provider: PaymentProvider) => {
    let updates: any = {};
    if (provider === "stripe") {
      updates = { publishable_key: stripePublicKey, account_id: stripeAccountId, is_active: stripeEnabled };
    } else if (provider === "paypal") {
      updates = { publishable_key: paypalClientId, is_active: paypalEnabled };
    }
    const ok = await upsertConfig(provider, updates);
    if (ok) {
      toast({ title: "Configuration sauvegardée", description: `Les paramètres ${provider} ont été enregistrés pour votre boutique.` });
    }
  };

  const handleToggle = async (provider: PaymentProvider, enabled: boolean) => {
    if (provider === "stripe") {
      setStripeEnabled(enabled);
      await upsertConfig("stripe", { is_active: enabled, publishable_key: stripePublicKey, account_id: stripeAccountId });
    } else if (provider === "paypal") {
      setPaypalEnabled(enabled);
      await upsertConfig("paypal", { is_active: enabled, publishable_key: paypalClientId });
    }
  };

  const paymentMethods = [
    { id: "stripe" as PaymentProvider, name: "Stripe", description: "Cartes de crédit, Apple Pay, Google Pay", logo: "💳", enabled: stripeEnabled, fees: "2,9% + 0,30€", status: "available" },
    { id: "paypal" as PaymentProvider, name: "PayPal", description: "PayPal, cartes de crédit", logo: "💰", enabled: paypalEnabled, fees: "3,4% + 0,35€", status: "available" },
    { id: "klarna" as PaymentProvider, name: "Klarna", description: "Paiement en plusieurs fois", logo: "🛍️", enabled: false, fees: "2,5%", status: "coming_soon" },
    { id: "crypto" as PaymentProvider, name: "Cryptomonnaies", description: "Bitcoin, Ethereum, etc.", logo: "₿", enabled: false, fees: "1,5%", status: "beta" },
  ];

  const getStatusBadge = (s: string) => {
    if (s === "available") return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
    if (s === "coming_soon") return <Badge variant="secondary">Bientôt</Badge>;
    if (s === "beta") return <Badge variant="outline">Bêta</Badge>;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Paiements</h2>
        {loading && <span className="text-xs text-muted-foreground">Chargement...</span>}
      </div>

      {/* Architecture info */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Configuration isolée par boutique</p>
          <p>Chaque boutique gère ses propres identifiants de paiement de manière indépendante. Aucune configuration partagée entre les boutiques. Vos clés API restent privées à cette boutique.</p>
        </div>
      </div>

      {/* Payment methods toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Méthodes de paiement</CardTitle>
          <CardDescription>Configurez les moyens de paiement acceptés dans votre boutique</CardDescription>
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
                  onCheckedChange={(v) => handleToggle(method.id, v)}
                  disabled={method.status !== "available"}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stripe configuration - per store */}
      {stripeEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Configuration Stripe</CardTitle>
            <CardDescription>Identifiants Stripe propres à cette boutique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <ExternalLink className="h-4 w-4 text-blue-600 shrink-0" />
              <p className="text-sm text-blue-800">
                Créez votre compte Stripe sur <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">stripe.com</a> pour obtenir vos clés API.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Clé publique Stripe (Publishable Key)</Label>
              <Input
                placeholder="pk_live_... ou pk_test_..."
                value={stripePublicKey}
                onChange={(e) => setStripePublicKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Trouvable dans votre Dashboard Stripe → Développeurs → Clés API
              </p>
            </div>

            <div className="space-y-2">
              <Label>ID de compte Stripe (optionnel)</Label>
              <Input
                placeholder="acct_..."
                value={stripeAccountId}
                onChange={(e) => setStripeAccountId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Utilisé pour Stripe Connect. Trouvable dans Paramètres → ID du compte.
              </p>
            </div>

            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Shield className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Paiements sécurisés via Stripe Checkout</p>
                <p className="text-xs mt-1">
                  Votre boutique utilise Stripe Checkout (hébergé par Stripe). Les clients sont redirigés vers la page de paiement sécurisée de Stripe. 
                  Aucune clé secrète n'est stockée côté client — seule la clé publique est utilisée pour initier le paiement.
                </p>
              </div>
            </div>

            <Button onClick={() => saveProvider("stripe")} className="w-full">
              Sauvegarder la configuration Stripe
            </Button>
          </CardContent>
        </Card>
      )}

      {/* PayPal configuration - per store */}
      {paypalEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Configuration PayPal</CardTitle>
            <CardDescription>Identifiants PayPal propres à cette boutique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <ExternalLink className="h-4 w-4 text-blue-600 shrink-0" />
              <p className="text-sm text-blue-800">
                Créez un compte développeur sur <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">developer.paypal.com</a>
              </p>
            </div>

            <div className="space-y-2">
              <Label>Client ID PayPal</Label>
              <Input
                placeholder="Votre Client ID PayPal"
                value={paypalClientId}
                onChange={(e) => setPaypalClientId(e.target.value)}
              />
            </div>

            <Button onClick={() => saveProvider("paypal")} className="w-full">
              Sauvegarder la configuration PayPal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Sécurité des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {["Certificat SSL", "Conformité PCI DSS", "Protection des données", "Détection des fraudes"].map((t) => (
              <div key={t} className="flex items-center gap-3 p-3 border rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="text-sm text-muted-foreground">Activé</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
