import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { sendEmail } from "@/utils/email";

interface NewsletterProps {
  t: any;
}

export const Newsletter = ({ t }: NewsletterProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!t?.footer?.newsletter || !t?.footer?.emailPlaceholder || !t?.footer?.subscribe ||
      typeof t.footer.newsletter !== 'string' ||
      typeof t.footer.emailPlaceholder !== 'string' ||
      typeof t.footer.subscribe !== 'string') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
      });
      return;
    }

    setIsLoading(true);

    try {
      await sendEmail({
        to: [email],
        subject: "Confirmation d'inscription à la newsletter",
        html: `
          <h1>Merci de vous être inscrit à notre newsletter !</h1>
          <p>Vous recevrez désormais nos dernières actualités et offres spéciales.</p>
        `
      });

      toast({
        title: "Succès !",
        description: "Vous êtes maintenant inscrit à notre newsletter",
      });

      setEmail("");
    } catch (error) {
      console.error("Erreur lors de l'inscription à la newsletter:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">{t.footer.newsletter}</h3>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.footer.emailPlaceholder}
          className="bg-gray-800 border-gray-700"
          required
        />
        <Button 
          variant="secondary" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "..." : t.footer.subscribe}
        </Button>
      </form>
    </div>
  );
};