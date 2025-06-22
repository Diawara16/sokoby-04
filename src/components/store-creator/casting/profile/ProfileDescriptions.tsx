
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface ProfileDescriptionsProps {
  control: any;
}

export const ProfileDescriptions = ({ control }: ProfileDescriptionsProps) => {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
    </>
  );
};
