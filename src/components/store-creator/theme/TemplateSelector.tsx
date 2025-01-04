import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeTemplate } from "@/types/theme";
import { useToast } from "@/hooks/use-toast";

interface TemplateSelectorProps {
  templates: ThemeTemplate[];
  selectedTemplateId?: string;
  onTemplateChange: (templateId: string) => void;
}

export const TemplateSelector = ({
  templates,
  selectedTemplateId,
  onTemplateChange,
}: TemplateSelectorProps) => {
  const { toast } = useToast();

  const handleTemplateChange = (templateId: string) => {
    try {
      onTemplateChange(templateId);
    } catch (error) {
      console.error('Error changing template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le template",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Palette className="h-5 w-5" />
        Template de base
      </h3>
      <Select
        value={selectedTemplateId}
        onValueChange={handleTemplateChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choisir un template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
};