import { Button } from "@/components/ui/button";

interface CTASectionProps {
  currentLanguage: string;
  onCreateStore: () => void;
}

export function CTASection({ currentLanguage, onCreateStore }: CTASectionProps) {
  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Prêt à lancer votre boutique en ligne ?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Commencez gratuitement et développez votre présence en ligne dès aujourd'hui.
        </p>
        <Button 
          size="lg" 
          onClick={onCreateStore}
          className="bg-white text-primary hover:bg-white/90"
        >
          Créer ma boutique gratuitement
        </Button>
      </div>
    </section>
  );
}