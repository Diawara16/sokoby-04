import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface StaffAccessProps {
  posAccess: boolean;
  setPosAccess: (value: boolean) => void;
}

export const StaffAccess = ({ posAccess, setPosAccess }: StaffAccessProps) => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-4">Paramètres du personnel</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Accès au point de vente</Label>
            <p className="text-sm text-gray-600">Autoriser l'accès à l'application POS</p>
          </div>
          <Switch 
            checked={posAccess}
            onCheckedChange={setPosAccess}
          />
        </div>
      </div>
    </div>
  );
};