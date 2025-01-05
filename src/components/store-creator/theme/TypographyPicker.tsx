import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TypographyPickerProps {
  fontFamily: string;
  fontSize: string;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
}

export function TypographyPicker({
  fontFamily,
  fontSize,
  onFontFamilyChange,
  onFontSizeChange
}: TypographyPickerProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Police</Label>
        <Select value={fontFamily} onValueChange={onFontFamilyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une police" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inter">Inter</SelectItem>
            <SelectItem value="roboto">Roboto</SelectItem>
            <SelectItem value="poppins">Poppins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Taille de police</Label>
        <Input
          type="text"
          value={fontSize}
          onChange={(e) => onFontSizeChange(e.target.value)}
        />
      </div>
    </div>
  );
}