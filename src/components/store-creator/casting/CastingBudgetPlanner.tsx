
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';
import { BudgetSimulator } from './budget/BudgetSimulator';
import { BudgetBreakdown } from './budget/BudgetBreakdown';
import { QualityLevels } from './budget/QualityLevels';

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
  
  return (
    <div className="space-y-6">
      <BudgetSimulator budget={budget} onBudgetChange={onBudgetChange} />
      
      <BudgetBreakdown selectedCandidates={selectedCandidates} />
      
      <QualityLevels budget={budget} />

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
