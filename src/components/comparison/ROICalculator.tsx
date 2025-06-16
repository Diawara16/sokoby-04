
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";

export function ROICalculator() {
  const [timeValue, setTimeValue] = useState(25); // €/heure
  const [hoursToCreate, setHoursToCreate] = useState(40);
  
  const laborCost = timeValue * hoursToCreate;
  const aiCost = 80; // Max AI cost
  const savings = laborCost - aiCost;
  const roi = ((savings / aiCost) * 100).toFixed(0);

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Calculateur de ROI
        </CardTitle>
        <CardDescription>
          Calculez vos économies réelles avec la Boutique IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="timeValue">Votre taux horaire (€)</Label>
            <Input
              id="timeValue"
              type="number"
              value={timeValue}
              onChange={(e) => setTimeValue(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hours">Heures pour créer manuellement</Label>
            <Input
              id="hours"
              type="number"
              value={hoursToCreate}
              onChange={(e) => setHoursToCreate(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Coût manuel</div>
              <div className="text-xl font-bold text-red-600">€{laborCost}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Coût IA</div>
              <div className="text-xl font-bold text-blue-600">€{aiCost}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Économies</div>
              <div className="text-xl font-bold text-green-600">€{savings}</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold text-green-600">ROI: +{roi}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
