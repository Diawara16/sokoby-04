import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAutosave } from "@/hooks/useAutosave";
import { AutosaveIndicator } from "./AutosaveIndicator";
import { CreditCard, Shield, AlertCircle, Check, Info } from "lucide-react";

// Only store non-sensitive config in client-accessible JSONB
interface PaymentData {
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  stripePublicKey: string;
  paypalClientId: string;
}

export function StorePaymentSettings() {
  const [data, setData] = useState<PaymentData>({
    stripeEnabled: false,
    paypalEnabled: false,
    stripePublicKey: "",
    paypalClientId: "",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: store } = await supabase
          .from("store_settings")
          .select("payment_settings")
          .eq("user_id", user.id)
          .maybeSingle();
        if (store) {
          const ps = (store as any).payment_settings || {};
          setData({
            stripeEnabled: ps.stripeEnabled || false,
            paypalEnabled: ps.paypalEnabled || false,
            stripePublicKey: ps.stripePublicKey || "",
            paypalClientId: ps.paypalClientId || "",
          });
        }
      } catch (err) {
        console.error("Failed to load payment settings:", err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const saveToDb = useCallback(async (saveData: PaymentData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    // Never store secret keys in client-accessible storage
    const { error } = await supabase
      .from("store_settings")
      .update({ payment_settings: saveData, updated_at: new Date().toISOString() } as any)
      .eq("user_id", user.id);
    return !error;
  }, []);

  const { status, debouncedSave } = useAutosave({ onSave: saveToDb });

  const update = (patch: Partial<PaymentData>) => {
    const next = { ...data, ...patch };
    setData(next);
    if (loaded) debouncedSave(next);
  };

  const paymentMethods = [
    { id: "stripe", name: "Stripe", description: "Cartes de crédit, Apple Pay, Google Pay", logo: "💳", enabled: data.stripeEnabled, onToggle: (v: boolean) => update({ stripeEnabled: v }), status: "available", fees: "2,9% + 0,30€" },
    { id: "paypal", name: "PayPal", description: "PayPal, cartes de crédit", logo: "💰", enabled: data.paypalEnabled, onToggle: (v: boolean) => update({ paypalEnabled: v }), status: "available", fees: "3,4% + 0,35€" },
    { id: "klarna", name: "Klarna", description: "Paiement en plusieurs fois", logo: "🛍️", enabled: false, onToggle: () => {}, status: "coming_soon", fees: "2,5%" },
    { id: "crypto", name: "Cryptomonnaies", description: "Bitcoin, Ethereum, etc.", logo: "₿", enabled: false, onToggle: () => {}, status: "beta", fees: "1,5%" },
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
        <AutosaveIndicator status={status} />
      </div>

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
                    <div className="flex items-center gap-2"><h4 className="font-medium">{method.name}</h4>{getStatusBadge(method.status)}</div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <p className="text-xs text-muted-foreground">Frais: {method.fees}</p>
                  </div>
                </div>
                <Switch checked={method.enabled} onCheckedChange={method.onToggle} disabled={method.status !== "available"} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {data.stripeEnabled && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Configuration Stripe</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">Créez un compte Stripe sur <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="underline">stripe.com</a> pour obtenir vos clés API.</p>
            </div>
            <div className="space-y-2">
              <Label>Clé publique Stripe</Label>
              <Input placeholder="pk_test_..." value={data.stripePublicKey} onChange={(e) => update({ stripePublicKey: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
              <Info className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                La clé secrète Stripe est stockée de manière sécurisée côté serveur via les variables d'environnement. 
                Configurez-la dans les paramètres Supabase Edge Functions.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.paypalEnabled && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Configuration PayPal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"><AlertCircle className="h-4 w-4 text-blue-600" /><p className="text-sm text-blue-800">Créez un compte développeur PayPal sur <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" className="underline">developer.paypal.com</a>.</p></div>
            <div className="space-y-2"><Label>Client ID PayPal</Label><Input placeholder="YOUR_PAYPAL_CLIENT_ID" value={data.paypalClientId} onChange={(e) => update({ paypalClientId: e.target.value })} /></div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Sécurité des paiements</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {["Certificat SSL", "Conformité PCI DSS", "Protection des données", "Détection des fraudes"].map((t) => (
              <div key={t} className="flex items-center gap-3 p-3 border rounded-lg"><Check className="h-5 w-5 text-green-600" /><div><p className="font-medium">{t}</p><p className="text-sm text-muted-foreground">Activé</p></div></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
