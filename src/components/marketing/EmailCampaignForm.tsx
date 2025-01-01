import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function EmailCampaignForm() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // Créer la campagne
      const { data: campaign, error: campaignError } = await supabase
        .from("email_campaigns")
        .insert({
          name,
          subject,
          content,
          status: "draft"
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Envoyer les emails
      const { error: sendError } = await supabase.functions.invoke("send-marketing-email", {
        body: { campaignId: campaign.id }
      });

      if (sendError) throw sendError;

      toast({
        title: "Campagne envoyée",
        description: "Vos emails marketing ont été envoyés avec succès",
      });

      // Réinitialiser le formulaire
      setName("");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la campagne:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la campagne",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nouvelle Campagne Email</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Nom de la campagne"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Sujet de l'email"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Contenu de l'email (HTML supporté)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
              required
            />
          </div>
          <Button type="submit" disabled={isSending} className="w-full">
            {isSending ? "Envoi en cours..." : "Envoyer la campagne"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}