import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CollaborationPolicyProps {
  invitePolicy: string;
  setInvitePolicy: (value: string) => void;
}

export const CollaborationPolicy = ({ invitePolicy, setInvitePolicy }: CollaborationPolicyProps) => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-4">Politique de collaboration</h4>
      <RadioGroup value={invitePolicy} onValueChange={setInvitePolicy}>
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="open" id="open" />
          <Label htmlFor="open">Tout le monde peut envoyer une requête de collaborateur</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="restricted" id="restricted" />
          <Label htmlFor="restricted">
            Seules les personnes avec un code de requête peuvent envoyer une demande
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};