import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CustomerEditFormProps {
  customer: {
    id: string;
    full_name: string;
    phone_number: string;
    customer_type: string;
    company_name: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    postal_code: string | null;
    notes: string | null;
  };
  onClose: () => void;
  onUpdate: () => void;
}

export const CustomerEditForm = ({ customer, onClose, onUpdate }: CustomerEditFormProps) => {
  const [formData, setFormData] = useState(customer);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('customer_details')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          customer_type: formData.customer_type,
          company_name: formData.company_name,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postal_code: formData.postal_code,
          notes: formData.notes,
        })
        .eq('id', customer.id);

      if (error) throw error;

      toast({
        title: "Client mis à jour",
        description: "Les informations du client ont été mises à jour avec succès",
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error updating customer:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations du client",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="full_name" className="text-sm font-medium">Nom complet</label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone_number" className="text-sm font-medium">Téléphone</label>
          <Input
            id="phone_number"
            value={formData.phone_number || ''}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="customer_type" className="text-sm font-medium">Type de client</label>
          <Select
            value={formData.customer_type}
            onValueChange={(value) => setFormData({ ...formData, customer_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Particulier</SelectItem>
              <SelectItem value="business">Entreprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.customer_type === 'business' && (
          <div className="space-y-2">
            <label htmlFor="company_name" className="text-sm font-medium">Nom de l'entreprise</label>
            <Input
              id="company_name"
              value={formData.company_name || ''}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">Adresse</label>
          <Input
            id="address"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">Ville</label>
          <Input
            id="city"
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="postal_code" className="text-sm font-medium">Code postal</label>
          <Input
            id="postal_code"
            value={formData.postal_code || ''}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">Pays</label>
          <Input
            id="country"
            value={formData.country || ''}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">Notes</label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} type="button">
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </form>
  );
};