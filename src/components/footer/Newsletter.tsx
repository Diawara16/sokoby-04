
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from "@/utils/email";
import { T } from "@/components/translation/T";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      <h3 className="text-lg font-semibold mb-4">
        <T>Newsletter</T>
      </h3>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          className="bg-gray-800 border-gray-700"
          required
        />
        <Button 
          variant="secondary" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "..." : <T>S'abonner</T>}
        </Button>
      </form>
    </div>
  );
};
