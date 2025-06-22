
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface QualityLevelsProps {
  budget: { min: number; max: number };
}

export const QualityLevels = ({ budget }: QualityLevelsProps) => {
  const qualityLevels = [
    {
      name: useTranslation('Économique'),
      range: '800-1200€',
      description: useTranslation('Qualité correcte, présentateur débutant talentueux'),
      features: [
        'Présentateur débutant expérimenté',
        'Équipe technique réduite',
        'Matériel standard',
        'Tournage en extérieur ou bureau'
      ]
    },
    {
      name: useTranslation('Professionnel'),
      range: '1200-1800€',
      description: useTranslation('Qualité élevée, présentateur expérimenté'),
      features: [
        'Présentateur professionnel confirmé',
        'Équipe technique complète',
        'Matériel professionnel 4K',
        'Studio ou location de qualité'
      ]
    },
    {
      name: useTranslation('Premium'),
      range: '1800-2500€',
      description: useTranslation('Qualité exceptionnelle, expert reconnu'),
      features: [
        'Présentateur expert reconnu',
        'Équipe technique premium',
        'Matériel haute gamme',
        'Studio professionnel premium'
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {useTranslation('Niveaux de qualité')}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {qualityLevels.map((level, index) => {
            const inBudget = budget.max >= parseInt(level.range.split('-')[0]);
            
            return (
              <Card 
                key={index}
                className={`relative ${inBudget ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
              >
                <CardContent className="p-4">
                  {inBudget && (
                    <Badge className="absolute -top-2 left-4 bg-primary">
                      {useTranslation('Accessible')}
                    </Badge>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">{level.name}</h4>
                      <p className="text-sm font-medium text-primary">{level.range}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {level.description}
                      </p>
                    </div>
                    
                    <ul className="space-y-1">
                      {level.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-xs flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
