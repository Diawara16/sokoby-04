
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CheckCircle, ArrowRight, ShoppingCart, Users, FileText, Shield } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ShopifyMigration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shopify_store_url: '',
    contact_email: '',
    contact_phone: '',
    store_size: 'medium' as 'small' | 'medium' | 'large',
    migration_type: {
      products: true,
      customers: true,
      orders: true
    },
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Vous devez être connecté');
      }

      const { data, error } = await supabase.functions.invoke('shopify-migration', {
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Demande de migration envoyée !",
        description: "Nous vous contactons sous 24h pour planifier votre migration gratuite.",
      });

      setStep(4); // Étape de confirmation
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-red-600" />
          Migration gratuite depuis Shopify
        </CardTitle>
        <CardDescription>
          Migrez votre boutique Shopify vers Sokoby en quelques clics. Notre équipe s'occupe de tout !
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <ShoppingCart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold">Produits</h3>
            <p className="text-sm text-gray-600">Catalogue complet</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold">Clients</h3>
            <p className="text-sm text-gray-600">Base de données</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold">Commandes</h3>
            <p className="text-sm text-gray-600">Historique complet</p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Migration 100% gratuite</h3>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Aucun frais caché</li>
            <li>• Support personnalisé inclus</li>
            <li>• Migration complète en 7 jours</li>
            <li>• Garantie de données sécurisées</li>
          </ul>
        </div>

        <Button 
          onClick={() => setStep(2)}
          className="w-full bg-red-600 hover:bg-red-700"
          size="lg"
        >
          Commencer ma migration gratuite
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Informations de votre boutique Shopify</CardTitle>
        <CardDescription>
          Ces informations nous permettront de préparer votre migration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4">
          <div>
            <Label htmlFor="shopify_store_url">URL de votre boutique Shopify *</Label>
            <Input
              id="shopify_store_url"
              type="url"
              placeholder="https://votre-boutique.myshopify.com"
              value={formData.shopify_store_url}
              onChange={(e) => setFormData(prev => ({ ...prev, shopify_store_url: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="contact_email">Email de contact *</Label>
            <Input
              id="contact_email"
              type="email"
              placeholder="votre@email.com"
              value={formData.contact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="contact_phone">Téléphone (optionnel)</Label>
            <Input
              id="contact_phone"
              type="tel"
              placeholder="+33 1 23 45 67 89"
              value={formData.contact_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
            />
          </div>

          <div>
            <Label>Taille de votre boutique</Label>
            <RadioGroup 
              value={formData.store_size} 
              onValueChange={(value: 'small' | 'medium' | 'large') => 
                setFormData(prev => ({ ...prev, store_size: value }))
              }
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small">Petite (moins de 100 produits)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Moyenne (100-1000 produits)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large">Grande (plus de 1000 produits)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
              Continuer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Que souhaitez-vous migrer ?</CardTitle>
        <CardDescription>
          Sélectionnez les éléments à transférer vers Sokoby
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="products"
                checked={formData.migration_type.products}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    migration_type: { ...prev.migration_type, products: !!checked }
                  }))
                }
              />
              <Label htmlFor="products" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Produits et catalogue
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="customers"
                checked={formData.migration_type.customers}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    migration_type: { ...prev.migration_type, customers: !!checked }
                  }))
                }
              />
              <Label htmlFor="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clients et contacts
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="orders"
                checked={formData.migration_type.orders}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    migration_type: { ...prev.migration_type, orders: !!checked }
                  }))
                }
              />
              <Label htmlFor="orders" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Commandes et historique
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes spéciales (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Informations complémentaires, demandes spécifiques..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Sécurité garantie</h3>
            </div>
            <p className="text-sm text-blue-700">
              Vos données sont chiffrées et traitées de manière sécurisée. 
              Nous respectons le RGPD et supprimons toutes les données temporaires après migration.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>
              Retour
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Lancer ma migration gratuite'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-green-800">Demande envoyée avec succès !</CardTitle>
        <CardDescription>
          Votre migration Shopify vers Sokoby est en cours de traitement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Prochaines étapes :</h3>
          <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
            <li>Notre équipe examine votre demande (sous 24h)</li>
            <li>Nous vous contactons pour planifier la migration</li>
            <li>Migration de vos données (5-7 jours ouvrés)</li>
            <li>Tests et validation avec vous</li>
            <li>Mise en ligne de votre nouvelle boutique Sokoby</li>
          </ol>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Vous pouvez suivre l'avancement de votre migration dans votre tableau de bord.
          </p>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Retour à l'accueil
            </Button>
            <Button 
              onClick={() => navigate('/tableau-de-bord')}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Voir mon tableau de bord
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Timeline des étapes */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step > stepNumber 
                      ? 'bg-green-600 text-white' 
                      : step === stepNumber 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-16 h-1 ${
                      step > stepNumber ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contenu des étapes */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </ProtectedRoute>
  );
}
