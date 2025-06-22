
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  Camera,
  Monitor
} from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface BudgetBreakdownProps {
  selectedCandidates: any[];
}

export const BudgetBreakdown = ({ selectedCandidates }: BudgetBreakdownProps) => {
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

  const totalWithOptional = budgetBreakdown.reduce((sum, item) => sum + item.base, 0);
  const totalEssential = budgetBreakdown.filter(item => item.essential).reduce((sum, item) => sum + item.base, 0);

  return (
    <Card>
      <CardContent className="p-6">
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

        <div className="border-t pt-4 space-y-2 mt-6">
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
  );
};
