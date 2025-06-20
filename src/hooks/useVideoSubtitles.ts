
import { useState, useEffect } from 'react';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { deepLService } from '@/services/deepLService';

interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
}

// Sous-titres de base en français
const frenchSubtitles: SubtitleSegment[] = [
  { start: 0, end: 10, text: "Bienvenue dans la démonstration de création de boutique IA" },
  { start: 10, end: 25, text: "Notre IA analyse votre niche et génère automatiquement tous les produits nécessaires" },
  { start: 25, end: 40, text: "En quelques minutes, votre boutique est créée avec design optimisé et fournisseurs intégrés" },
  { start: 40, end: 55, text: "Chaque produit est sélectionné et optimisé pour maximiser vos conversions" },
  { start: 55, end: 70, text: "Le SEO est configuré automatiquement pour améliorer votre visibilité" },
  { start: 70, end: 85, text: "Votre boutique est prête à vendre dès la fin de la génération" },
  { start: 85, end: 100, text: "Découvrez la puissance de l'IA pour votre e-commerce" },
  { start: 100, end: 120, text: "Créez votre boutique maintenant et rejoignez des milliers d'entrepreneurs satisfaits" },
  { start: 120, end: 140, text: "Notre support vous accompagne pour maximiser vos ventes" },
  { start: 140, end: 160, text: "Commencez votre essai gratuit dès aujourd'hui" },
  { start: 160, end: 180, text: "Votre succès commence ici avec notre technologie IA" },
  { start: 180, end: 204, text: "Merci d'avoir regardé cette démonstration" }
];

export function useVideoSubtitles() {
  const { currentLanguage } = useLanguageContext();
  const [translatedSubtitles, setTranslatedSubtitles] = useState<SubtitleSegment[]>(frenchSubtitles);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');

  useEffect(() => {
    const translateSubtitles = async () => {
      if (currentLanguage === 'fr') {
        setTranslatedSubtitles(frenchSubtitles);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await Promise.all(
          frenchSubtitles.map(async (subtitle) => ({
            ...subtitle,
            text: await deepLService.translate(subtitle.text, currentLanguage)
          }))
        );
        setTranslatedSubtitles(translated);
      } catch (error) {
        console.error('Erreur de traduction des sous-titres:', error);
        setTranslatedSubtitles(frenchSubtitles);
      } finally {
        setIsLoading(false);
      }
    };

    translateSubtitles();
  }, [currentLanguage]);

  const updateCurrentSubtitle = (currentTime: number) => {
    const activeSubtitle = translatedSubtitles.find(
      subtitle => currentTime >= subtitle.start && currentTime <= subtitle.end
    );
    setCurrentSubtitle(activeSubtitle?.text || '');
  };

  return {
    translatedSubtitles,
    currentSubtitle,
    isLoading,
    updateCurrentSubtitle
  };
}
