import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeTemplate } from "@/types/theme";

interface TemplateSelectorProps {
  templates: ThemeTemplate[];
  selectedTemplate: ThemeTemplate | null;
  onTemplateChange: (template: ThemeTemplate) => void;
}

export function TemplateSelector({
  templates,
  selectedTemplate,
  onTemplateChange
}: TemplateSelectorProps) {
  return (
    <div className="space-y-2">
      <Select
        value={selectedTemplate?.id}
        onValueChange={(value) => {
          const template = templates.find(t => t.id === value);
          if (template) onTemplateChange(template);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choisir un modèle" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}