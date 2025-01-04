import { Card } from "@/components/ui/card";
import { Type } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TypographyPickerProps {
  headingFont: string;
  bodyFont: string;
  onHeadingChange: (font: string) => void;
  onBodyChange: (font: string) => void;
}

export const TypographyPicker = ({
  headingFont,
  bodyFont,
  onHeadingChange,
  onBodyChange,
}: TypographyPickerProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Type className="h-5 w-5" />
        Typographie
      </h3>
      <div className="space-y-4">
        <Select value={headingFont} onValueChange={onHeadingChange}>
          <SelectTrigger>
            <SelectValue placeholder="Police des titres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Playfair Display">Playfair Display</SelectItem>
            <SelectItem value="Roboto">Roboto</SelectItem>
            <SelectItem value="Lora">Lora</SelectItem>
          </SelectContent>
        </Select>

        <Select value={bodyFont} onValueChange={onBodyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Police du texte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Raleway">Raleway</SelectItem>
            <SelectItem value="Open Sans">Open Sans</SelectItem>
            <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};