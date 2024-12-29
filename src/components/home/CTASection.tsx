import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { translations } from "@/translations";

interface CTASectionProps {
  currentLanguage: string;
  onCreateStore: () => void;
}

export const CTASection = ({ currentLanguage, onCreateStore }: CTASectionProps) => {
  const t = translations[currentLanguage as keyof typeof translations];

  if (!t || !t.cta || typeof t.cta.button !== 'string') {
    return null;
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
          {t.cta.title || ''}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {t.cta.subtitle || ''}
        </p>
        <Button 
          size="lg" 
          className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
          onClick={onCreateStore}
        >
          {t.cta.button}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};