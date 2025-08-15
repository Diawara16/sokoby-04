
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Wallet, Receipt, AlertTriangle } from "lucide-react";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const PaymentSettings = () => {
  const { isLoading, savePaymentSettings } = usePaymentSettings();
  const { toast } = useToast();
  const [interacEnabled, setInteracEnabled] = useState(false);
  const [interacEmail, setInteracEmail] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const loadInteracSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('interac_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erreur lors du chargement des paramètres Interac:', error);
        return;
      }

      if (data) {
        setInteracEnabled(data.enabled || false);
        setInteracEmail(data.email || '');
        setMerchantName(data.merchant_name || '');
      }
    };

    const loadSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setSubscription(data);
    };

    loadInteracSettings();
    loadSubscription();
  }, []);

  const handleSaveInterac = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Non authentifié');
      }

      const { error } = await supabase
        .from('interac_settings')
        .upsert({
          user_id: user.id,
          email: interacEmail,
          merchant_name: merchantName,
          enabled: interacEnabled
        });

      if (error) throw error;

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres Interac ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres Interac",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-billing-portal-session');
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error accessing billing portal:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'accéder au portail de facturation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Méthodes de paiement
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Stripe (USD)</Label>
              <div className="text-sm text-muted-foreground">
                Acceptez les paiements par carte bancaire
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>PayPal (USD)</Label>
              <div className="text-sm text-muted-foreground">
                Acceptez les paiements via PayPal
              </div>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Configuration Interac
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activer Interac</Label>
              <div className="text-sm text-muted-foreground">
                Acceptez les paiements via Virement Interac
              </div>
            </div>
            <Switch 
              checked={interacEnabled}
              onCheckedChange={setInteracEnabled}
            />
          </div>

          <div>
            <Label htmlFor="interac_email">Email pour les virements Interac</Label>
            <Input
              id="interac_email"
              type="email"
              value={interacEmail}
              onChange={(e) => setInteracEmail(e.target.value)}
              placeholder="payments@votreboutique.com"
            />
          </div>

          <div>
            <Label htmlFor="merchant_name">Nom du marchand</Label>
            <Input
              id="merchant_name"
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="Nom de votre entreprise"
            />
          </div>

          <Button 
            onClick={handleSaveInterac}
            disabled={isSaving}
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder les paramètres Interac'}
          </Button>
        </div>
      </Card>

      {/* Subscription Management */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Abonnement & Facturation
        </h2>
        
        {subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-800">Abonnement actif</p>
                <p className="text-sm text-green-600">
                  Statut: {subscription.status === 'active' ? 'Actif' : 'Inactif'}
                </p>
              </div>
            </div>
            
            <Button onClick={handleManageSubscription} className="w-full">
              Gérer l'abonnement (Annuler, Modifier)
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Vous serez redirigé vers Stripe pour gérer votre abonnement en toute sécurité
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">Aucun abonnement actif</p>
            <Button variant="outline" asChild>
              <a href="/plan-tarifaire">Choisir un plan</a>
            </Button>
          </div>
        )}
      </Card>

      {/* Emergency Contact */}
      <Card className="border-orange-200 bg-orange-50 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Besoin d'aide pour annuler ?
        </h2>
        
        <div className="space-y-2 text-sm text-orange-700">
          <p>Si vous rencontrez des problèmes pour annuler votre abonnement :</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Contactez le support Stripe directement</li>
            <li>Envoyez un email à notre équipe support</li>
            <li>Le portail Stripe vous permet d'annuler immédiatement</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSettings;
