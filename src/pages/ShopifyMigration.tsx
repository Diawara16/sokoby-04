import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CheckCircle, ArrowRight, ShoppingCart, Users, FileText, Shield } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlatformSelector } from "@/components/migration/PlatformSelector";
import { PlatformSpecificForm } from "@/components/migration/PlatformSpecificForm";

export default function ShopifyMigration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [formData, setFormData] = useState({
    source_platform: '',
    store_url: '',
    access_token: '',
    api_key: '',
    username: '',
    password: '',
    database_host: '',
    database_name: '',
    admin_url: '',
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

  const handlePlatformFormChange = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Vous devez être connecté');
      }

      // Prepare submission data based on platform
      const submissionData = {
        source_platform: selectedPlatform,
        shopify_store_url: selectedPlatform === 'shopify' ? formData.store_url : null,
        shopify_access_token: selectedPlatform === 'shopify' ? formData.access_token : null,
        store_url: formData.store_url,
        api_credentials: {
          access_token: formData.access_token,
          api_key: formData.api_key,
          username: formData.username,
          password: formData.password,
          database_host: formData.database_host,
          database_name: formData.database_name,
          admin_url: formData.admin_url
        },
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        store_size: formData.store_size,
        migration_type: formData.migration_type,
        notes: formData.notes
      };

      const { data, error } = await supabase.functions.invoke('shopify-migration', {
        body: submissionData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Demande de migration envoyée !",
        description: "Nous vous contactons sous 24h pour planifier votre migration gratuite.",
      });

      setStep(5); // Étape de confirmation
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
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <ShoppingCart className="h-6 w-6 text-red-600" />
          Migration gratuite multi-plateformes
        </CardTitle>
        <CardDescription>
          Migrez depuis n'importe quelle plateforme e-commerce vers Sokoby en quelques clics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PlatformSelector 
          selectedPlatform={selectedPlatform}
          onPlatformSelect={setSelectedPlatform}
        />

        {selectedPlatform && (
          <div className="pt-6 border-t">
            <Button 
              onClick={() => {
                setFormData(prev => ({ ...prev, source_platform: selectedPlatform }));
                setStep(2);
              }}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              Continuer avec {selectedPlatform}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <PlatformSpecificForm
        platform={selectedPlatform}
        formData={formData}
        onChange={handlePlatformFormChange}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Informations de contact</CardTitle>
          <CardDescription>Pour vous tenir informé du processus de migration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact_email">Email de contact *</Label>
            <input
              id="contact_email"
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="votre@email.com"
              value={formData.contact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="contact_phone">Téléphone (optionnel)</Label>
            <input
              id="contact_phone"
              type="tel"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => setStep(1)}>
          Retour
        </Button>
        <Button 
          onClick={() => setStep(3)} 
          className="flex-1 bg-red-600 hover:bg-red-700"
          disabled={!formData.store_url || !formData.contact_email}
        >
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
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
          Votre migration vers Sokoby est en cours de traitement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Prochaines étapes :</h3>
          <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
            <li>Notre équipe examine votre demande (sous 24h)</li>
            <li>Nous vous contactons pour planifier la migration</li>
            <li>Migration de vos données (durée selon la plateforme)</li>
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
          <div className="max-w-4xl mx-auto mb-8">
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
