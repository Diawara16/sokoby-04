
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface SkillsManagerProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export const SkillsManager = ({ skills, onSkillsChange }: SkillsManagerProps) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onSkillsChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div>
      <Label>{useTranslation('Compétences spécifiques')}</Label>
      <div className="flex items-center gap-2 mt-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder={useTranslation('Ex: Présentation produit, B2B, E-commerce...')}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
        />
        <Button type="button" onClick={addSkill} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
