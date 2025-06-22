
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { User, Save } from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';
import { ProfileBasicInfo } from './profile/ProfileBasicInfo';
import { SkillsManager } from './profile/SkillsManager';
import { ProfileDescriptions } from './profile/ProfileDescriptions';

interface CastingProfileFormProps {
  onProfileSaved: (profile: any) => void;
  currentProfile?: any;
}

export const CastingProfileForm = ({ onProfileSaved, currentProfile }: CastingProfileFormProps) => {
  const [skills, setSkills] = useState<string[]>(currentProfile?.skills || []);

  const form = useForm({
    defaultValues: {
      ageRange: currentProfile?.ageRange || '25-40',
      gender: currentProfile?.gender || 'any',
      experience: currentProfile?.experience || 'professional',
      style: currentProfile?.style || 'business-casual',
      language: currentProfile?.language || 'french-native',
      availability: currentProfile?.availability || 'flexible',
      budget: currentProfile?.budget || 'mid-range',
      description: currentProfile?.description || '',
      requirements: currentProfile?.requirements || ''
    }
  });

  const onSubmit = (data: any) => {
    const profile = {
      ...data,
      skills,
      createdAt: new Date().toISOString()
    };
    onProfileSaved(profile);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>{useTranslation('Définir le profil recherché')}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProfileBasicInfo control={form.control} />
            
            <SkillsManager skills={skills} onSkillsChange={setSkills} />
            
            <ProfileDescriptions control={form.control} />

            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {useTranslation('Enregistrer le profil')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
