import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { translations } from "@/translations";
import { useState } from "react";
import { CouponSection } from "./CouponSection";
import { PaymentButtons } from "./PaymentButtons";

interface PricingPlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  planType: 'starter' | 'pro' | 'enterprise';
  features: string[];
  popular?: boolean;
  trial?: boolean;
  onSubscribe: (planType: 'starter' | 'pro' | 'enterprise', paymentMethod: 'card' | 'apple_pay' | 'google_pay', couponCode?: string) => void;
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
  const [couponCode, setCouponCode] = useState("");
  const t = translations[currentLanguage as keyof typeof translations];

  // Formatage du prix pour toujours afficher le symbole $ avant le montant
  const formattedPrice = price.startsWith('$') ? price : `$${price}`;

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
          <span className="text-5xl font-extrabold text-black">{formattedPrice}</span>
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
        <CouponSection 
          couponCode={couponCode} 
          setCouponCode={setCouponCode} 
        />
        <PaymentButtons 
          planType={planType} 
          couponCode={couponCode} 
          onSubscribe={onSubscribe} 
        />
      </div>
    </Card>
  );
}