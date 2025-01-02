import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface StaffInviteFormProps {
  onInviteSent: () => void;
  staffCount: number;
  storeId: string;
}

export const StaffInviteForm = ({ onInviteSent, staffCount, storeId }: StaffInviteFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour inviter des membres");
      }

      const { error } = await supabase
        .from('staff_members')
        .insert([
          {
            email,
            store_id: storeId,
            user_id: user.id,
            role: 'staff',
            permissions: {},
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Invitation envoyée",
        description: `Une invitation a été envoyée à ${email}`,
      });

      setEmail("");
      onInviteSent();
    } catch (error: any) {
      console.error('Erreur lors de l\'invitation:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email du membre à inviter</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : "Envoyer l'invitation"}
        </Button>
      </form>
    </Card>
  );
};