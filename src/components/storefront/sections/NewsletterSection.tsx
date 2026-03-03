import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSectionProps {
  config: {
    title?: string;
    subtitle?: string;
    button_text?: string;
  };
}

export function NewsletterSection({ config }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const title = config.title || "Restez informé";
  const subtitle = config.subtitle || "Inscrivez-vous à notre newsletter pour recevoir nos dernières offres.";
  const buttonText = config.button_text || "S'inscrire";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "Merci !", description: "Vous êtes inscrit à notre newsletter." });
    setEmail("");
  };

  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">{buttonText}</Button>
        </form>
      </div>
    </section>
  );
}
