
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { User, Save, Plus, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface CastingProfileFormProps {
  onProfileSaved: (profile: any) => void;
  currentProfile?: any;
}

export const CastingProfileForm = ({ onProfileSaved, currentProfile }: CastingProfileFormProps) => {
  const [skills, setSkills] = useState<string[]>(currentProfile?.skills || []);
  const [newSkill, setNewSkill] = useState('');

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

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ageRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{useTranslation('Tranche d\'âge')}</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded-md">
                        <option value="20-30">20-30 ans</option>
                        <option value="25-40">25-40 ans</option>
                        <option value="30-45">30-45 ans</option>
                        <option value="35-50">35-50 ans</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{useTranslation('Genre')}</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded-md">
                        <option value="any">{useTranslation('Indifférent')}</option>
                        <option value="male">{useTranslation('Homme')}</option>
                        <option value="female">{useTranslation('Femme')}</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{useTranslation('Niveau d\'expérience')}</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded-md">
                        <option value="beginner">{useTranslation('Débutant talentueux')}</option>
                        <option value="professional">{useTranslation('Professionnel expérimenté')}</option>
                        <option value="expert">{useTranslation('Expert reconnu')}</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{useTranslation('Style recherché')}</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded-md">
                        <option value="business-casual">Business Casual</option>
                        <option value="formal">Formel/Corporate</option>
                        <option value="modern">Moderne/Tech</option>
                        <option value="friendly">Accessible/Convivial</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{useTranslation('Compétences linguistiques')}</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded-md">
                        <option value="french-native">{useTranslation('Français natif')}</option>
                        <option value="french-fluent">{useTranslation('Français courant')}</option>
                        <option value="bilingual">{useTranslation('Bilingue FR/EN')}</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{useTranslation('Gamme de budget')}</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded-md">
                        <option value="low">200-400€ (Débutant)</option>
                        <option value="mid-range">500-800€ (Professionnel)</option>
                        <option value="high">800-1500€ (Expert)</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Compétences spécifiques */}
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{useTranslation('Description du rôle')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={useTranslation('Décrivez le type de présentation, le ton souhaité, les messages clés...')}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{useTranslation('Exigences particulières')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={useTranslation('Équipement requis, lieu de tournage, contraintes de planning...')}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
