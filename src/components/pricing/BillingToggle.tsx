import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BillingToggleProps {
  isAnnual: boolean;
  onChange: (value: boolean) => void;
}

export const BillingToggle = ({ isAnnual, onChange }: BillingToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Label htmlFor="billing-toggle" className="text-sm font-medium">
        Mensuel
      </Label>
      <Switch
        id="billing-toggle"
        checked={isAnnual}
        onCheckedChange={onChange}
      />
      <div className="flex items-center gap-2">
        <Label htmlFor="billing-toggle" className="text-sm font-medium">
          Annuel
        </Label>
        <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
          -17%
        </span>
      </div>
    </div>
  );
};