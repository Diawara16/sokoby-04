
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, MessageCircle, Users, Headphones } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    category: "",
    message: "",
    urgency: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    setTimeout(() => {
      toast({
        title: "Message envoyé avec succès !",
        description: "Nous vous répondrons dans les plus brefs délais selon la priorité de votre demande.",
      });
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        category: "",
        message: "",
        urgency: "normal"
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Chat en direct",
      description: "Réponse immédiate",
      details: "Disponible 24/7 pour vos questions urgentes",
      action: "Démarrer un chat",
      primary: true
    },
    {
      icon: Mail,
      title: "Email",
      description: "support@sokoby.com",
      details: "Réponse sous 2-4h en jours ouvrés",
      action: "Envoyer un email"
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "+33 1 23 45 67 89",
      details: "Lun-Ven 9h-18h, Sam 9h-13h",
      action: "Appeler maintenant"
    },
    {
      icon: Users,
      title: "Rendez-vous",
      description: "Consultation personnalisée",
      details: "Session de 30min avec un expert",
      action: "Planifier"
    }
  ];

  const categories = [
    { value: "technical", label: "Support technique" },
    { value: "billing", label: "Facturation et abonnements" },
    { value: "sales", label: "Questions commerciales" },
    { value: "partnership", label: "Partenariats" },
    { value: "feature", label: "Demande de fonctionnalité" },
    { value: "other", label: "Autre" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Headphones className="h-4 w-4 mr-2" />
            Support client disponible 24/7
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Contactez-nous
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe d'experts est là pour vous accompagner dans votre réussite. 
            Choisissez le moyen de contact qui vous convient le mieux.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <Card key={index} className={`text-center hover:shadow-lg transition-all duration-300 ${
                method.primary ? 'ring-2 ring-red-200 bg-red-50' : ''
              }`}>
                <CardHeader>
                  <IconComponent className={`h-12 w-12 mx-auto mb-4 ${
                    method.primary ? 'text-red-600' : 'text-gray-600'
                  }`} />
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <p className={`font-medium ${
                    method.primary ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {method.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{method.details}</p>
                  <Button 
                    size="sm" 
                    className={method.primary ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}
                  >
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
              <p className="text-gray-600">Remplissez le formulaire ci-dessous et nous vous répondrons rapidement</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priorité
                    </label>
                    <Select value={formData.urgency} onValueChange={(value) => handleChange('urgency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="normal">Normale</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    required
                    placeholder="Résumé de votre demande"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    required
                    placeholder="Décrivez votre question ou problème en détail..."
                    rows={6}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">support@sokoby.com</p>
                    <p className="text-gray-600">sales@sokoby.com</p>
                    <p className="text-sm text-gray-500">Réponse sous 2-4h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Téléphone</h3>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                    <p className="text-sm text-gray-500">Lun-Ven 9h-18h, Sam 9h-13h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Adresse</h3>
                    <p className="text-gray-600">
                      123 Avenue de l'Innovation<br />
                      75008 Paris, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Horaires de support</h3>
                    <p className="text-gray-600">Chat : 24h/24, 7j/7</p>
                    <p className="text-gray-600">Téléphone : Lun-Sam 9h-18h</p>
                    <p className="text-gray-600">Email : Réponse sous 4h max</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🚀 Combien de temps pour créer ma boutique ?</h4>
                    <p className="text-sm text-gray-600">
                      En moyenne 10-15 minutes avec notre assistant IA.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">💳 Quels moyens de paiement acceptez-vous ?</h4>
                    <p className="text-sm text-gray-600">
                      Cartes bancaires, PayPal, virements et crypto-monnaies.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📞 Le support est-il vraiment 24/7 ?</h4>
                    <p className="text-sm text-gray-600">
                      Oui, notre chat est disponible 24h/24 avec des agents réels.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🔒 Mes données sont-elles sécurisées ?</h4>
                    <p className="text-sm text-gray-600">
                      Absolument. Nous utilisons un chiffrement bancaire (SSL 256-bit).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
