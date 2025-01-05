import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LayoutPickerProps {
  spacing: string;
  containerWidth: string;
  onSpacingChange: (value: string) => void;
  onContainerWidthChange: (value: string) => void;
}

export function LayoutPicker({ 
  spacing, 
  containerWidth, 
  onSpacingChange, 
  onContainerWidthChange 
}: LayoutPickerProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Espacement</Label>
        <Select value={spacing} onValueChange={onSpacingChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir l'espacement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="comfortable">Confortable</SelectItem>
            <SelectItem value="spacious">Spacieux</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Largeur du conteneur</Label>
        <Input
          type="text"
          value={containerWidth}
          onChange={(e) => onContainerWidthChange(e.target.value)}
        />
      </div>
    </div>
  );
}