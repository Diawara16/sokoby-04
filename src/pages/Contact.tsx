
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { sendEmail } from "@/utils/email";
import { Card } from "@/components/ui/card";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendEmail({
        to: ["support@sokoby.com"],
        subject: `Nouveau message de contact de ${name}`,
        html: `
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });

      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
        duration: 5000,
      });

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Contactez-nous</h1>
      
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <Card className="p-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Email</h2>
              <a href="mailto:support@sokoby.com" className="text-primary hover:underline">
                support@sokoby.com
              </a>
              <br />
              <a href="mailto:contact@sokoby.com" className="text-primary hover:underline">
                contact@sokoby.com
              </a>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Téléphone</h2>
              <p className="text-primary">+1 514 512 7993</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all md:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Adresse</h2>
              <p>7188 Rue Saint-hubert</p>
              <p>H2R2N1, Montréal, Québec</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contact Form */}
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-semibold mb-6">Formulaire de contact</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Votre message..."
              className="min-h-[150px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
