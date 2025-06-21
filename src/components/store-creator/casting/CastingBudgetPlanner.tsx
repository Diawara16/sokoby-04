
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Euro,
  TrendingUp,
  Clock,
  Users,
  Camera,
  Mic,
  Monitor
} from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface CastingBudgetPlannerProps {
  budget: { min: number; max: number };
  onBudgetChange: (budget: { min: number; max: number }) => void;
  selectedCandidates: any[];
}

export const CastingBudgetPlanner = ({ 
  budget, 
  onBudgetChange, 
  selectedCandidates 
}: CastingBudgetPlannerProps) => {
  
  const budgetBreakdown = [
    {
      category: useTranslation('Présentateur'),
      icon: Users,
      base: selectedCandidates.length > 0 ? selectedCandidates[0].dayRate : 600,
      description: useTranslation('Tarif journalier du présentateur sélectionné'),
      essential: true
    },
    {
      category: useTranslation('Équipe technique'),
      icon: Camera,
      base: 300,
      description: useTranslation('Cadreur, ingénieur son, éclairagiste'),
      essential: true
    },
    {
      category: useTranslation('Matériel'),
      icon: Monitor,
      base: 200,
      description: useTranslation('Caméras, micros, éclairage, prompteur'),
      essential: true
    },
    {
      category: useTranslation('Location studio'),
      icon: Camera,
      base: 150,
      description: useTranslation('Studio professionnel avec fond vert (optionnel)'),
      essential: false
    },
    {
      category: useTranslation('Post-production'),
      icon: Monitor,
      base: 250,
      description: useTranslation('Montage, synchronisation, export final'),
      essential: true
    }
  ];

  const totalEssential = budgetBreakdown
    .filter(item => item.essential)
    .reduce((sum, item) => sum + item.base, 0);

  const totalWithOptional = budgetBreakdown
    .reduce((sum, item) => sum + item.base, 0);

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
    <div className="space-y-6">
      {/* Simulateur de budget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            {useTranslation('Simulateur de budget')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{useTranslation('Budget souhaité')}</span>
              <Badge variant="outline">
                {budget.min}€ - {budget.max}€
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>500€</span>
                <span>3000€</span>
              </div>
              <Slider
                value={[budget.min, budget.max]}
                onValueChange={([min, max]) => onBudgetChange({ min, max })}
                max={3000}
                min={500}
                step={100}
                className="w-full"
              />
            </div>
          </div>

          {/* Répartition du budget */}
          <div className="space-y-4">
            <h4 className="font-medium">{useTranslation('Répartition recommandée')}</h4>
            
            {budgetBreakdown.map((item, index) => {
              const percentage = (item.base / totalWithOptional) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.category}</span>
                      {!item.essential && (
                        <Badge variant="secondary" className="text-xs">
                          {useTranslation('Optionnel')}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium">{item.base}€</span>
                  </div>
                  
                  <Progress value={percentage} className="h-2" />
                  
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Résumé budget */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between font-medium">
              <span>{useTranslation('Total essentiel')}</span>
              <span>{totalEssential}€</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{useTranslation('Avec options')}</span>
              <span>{totalWithOptional}€</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Niveaux de qualité */}
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

      {/* Conseils budget */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">
                {useTranslation('Conseils pour optimiser votre budget')}
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• {useTranslation('Privilégiez la qualité du présentateur, c\'est l\'élément le plus visible')}</li>
                <li>• {useTranslation('Le matériel peut être loué pour réduire les coûts')}</li>
                <li>• {useTranslation('Un bon montage peut compenser un budget équipement moindre')}</li>
                <li>• {useTranslation('Prévoyez 10-15% de marge pour les imprévus')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
