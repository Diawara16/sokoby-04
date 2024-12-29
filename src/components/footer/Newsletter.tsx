import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewsletterProps {
  t: any;
}

export const Newsletter = ({ t }: NewsletterProps) => {
  // Vérification que les traductions nécessaires existent et sont des chaînes
  if (!t?.footer?.newsletter || !t?.footer?.emailPlaceholder || !t?.footer?.subscribe ||
      typeof t.footer.newsletter !== 'string' ||
      typeof t.footer.emailPlaceholder !== 'string' ||
      typeof t.footer.subscribe !== 'string') {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">{t.footer.newsletter}</h3>
      <div className="flex space-x-2">
        <Input 
          type="email" 
          placeholder={t.footer.emailPlaceholder}
          className="bg-gray-800 border-gray-700"
        />
        <Button variant="secondary">{t.footer.subscribe}</Button>
      </div>
    </div>
  );
};