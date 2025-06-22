
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface ProfileBasicInfoProps {
  control: any;
}

export const ProfileBasicInfo = ({ control }: ProfileBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
  );
};
