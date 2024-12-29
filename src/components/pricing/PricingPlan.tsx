import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";
import { translations } from "@/translations";

interface PricingPlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  planType: 'starter' | 'pro' | 'enterprise';
  features: string[];
  popular?: boolean;
  trial?: boolean;
  onSubscribe: (planType: 'starter' | 'pro' | 'enterprise', paymentMethod: 'card' | 'paypal') => void;
  currentLanguage: string;
}

export function PricingPlan({
  name,
  price,
  period,
  description,
  planType,
  features,
  popular,
  trial,
  onSubscribe,
  currentLanguage,
}: PricingPlanProps) {
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <Card
      className={`relative p-8 rounded-lg ${
        popular
          ? "border-2 border-red-600 shadow-lg"
          : "border border-gray-200"
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
            {t.pricing.mostPopular}
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-black mb-2">{name}</h3>
        <div className="flex justify-center items-baseline mb-2">
          <span className="text-5xl font-extrabold text-black">{price}</span>
          {period && <span className="text-black ml-1">{period}</span>}
        </div>
        {trial && (
          <div className="text-sm text-red-600 font-medium mb-2">
            {t.pricing.freeTrial}
          </div>
        )}
        <p className="text-black mb-6">{description}</p>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-center">
            <Check className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-black">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        <Button
          className={`w-full ${
            popular
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-700 hover:bg-red-800 text-white"
          } transition-colors`}
          onClick={() => onSubscribe(planType, 'card')}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {t.pricing.startTrial}
        </Button>

        <Button
          variant="outline"
          className="w-full border-2 hover:bg-blue-50"
          onClick={() => onSubscribe(planType, 'paypal')}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5 8.5h-2.5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2h-2.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.5 8.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14v2" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Payer avec PayPal
        </Button>
      </div>
    </Card>
  );
}