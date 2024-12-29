import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactFieldsProps {
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  onChange: (field: string, value: string) => void;
}

export const ContactFields = ({ 
  storeEmail, 
  storePhone, 
  storeAddress, 
  onChange 
}: ContactFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="store_email">Email de contact</Label>
        <Input
          id="store_email"
          type="email"
          value={storeEmail}
          onChange={(e) => onChange('store_email', e.target.value)}
          placeholder="contact@maboutique.com"
        />
      </div>

      <div>
        <Label htmlFor="store_phone">Téléphone</Label>
        <Input
          id="store_phone"
          value={storePhone}
          onChange={(e) => onChange('store_phone', e.target.value)}
          placeholder="+33 1 23 45 67 89"
        />
      </div>

      <div>
        <Label htmlFor="store_address">Adresse</Label>
        <Input
          id="store_address"
          value={storeAddress}
          onChange={(e) => onChange('store_address', e.target.value)}
          placeholder="123 rue du Commerce, 75001 Paris"
        />
      </div>
    </>
  );
};