import { Card } from "@/components/ui/card";
import { Layout } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LayoutPickerProps {
  layoutStyle: string;
  spacing: string;
  onLayoutChange: (style: string) => void;
  onSpacingChange: (spacing: string) => void;
}

export const LayoutPicker = ({
  layoutStyle,
  spacing,
  onLayoutChange,
  onSpacingChange,
}: LayoutPickerProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Layout className="h-5 w-5" />
        Mise en page
      </h3>
      <div className="space-y-4">
        <Select value={layoutStyle} onValueChange={onLayoutChange}>
          <SelectTrigger>
            <SelectValue placeholder="Style de mise en page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="grid">Grille</SelectItem>
            <SelectItem value="organic">Organique</SelectItem>
          </SelectContent>
        </Select>

        <Select value={spacing} onValueChange={onSpacingChange}>
          <SelectTrigger>
            <SelectValue placeholder="Espacement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="airy">Aéré</SelectItem>
            <SelectItem value="breathable">Respirable</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};