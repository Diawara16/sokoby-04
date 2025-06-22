
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Euro } from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface BudgetSimulatorProps {
  budget: { min: number; max: number };
  onBudgetChange: (budget: { min: number; max: number }) => void;
}

export const BudgetSimulator = ({ budget, onBudgetChange }: BudgetSimulatorProps) => {
  return (
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
      </CardContent>
    </Card>
  );
};
