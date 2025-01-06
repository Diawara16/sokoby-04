import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CouponSection } from "./CouponSection";
import { PaymentButtons } from "./PaymentButtons";

interface PricingPlanProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  isPopular?: boolean;
  trial?: string;
  onSelect: (plan: string) => void;
  isAuthenticated: boolean;
  isCurrentPlan?: boolean;
  planType: 'starter' | 'pro' | 'enterprise';
  onSubscribe: (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay',
    couponCode?: string
  ) => void;
}

export const PricingPlan = ({
  name,
  price,
  period,
  features,
  isPopular,
  trial,
  isAuthenticated,
  isCurrentPlan,
  planType,
  onSubscribe
}: PricingPlanProps) => {
  const [showPayment, setShowPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Formatage du prix en USD
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(price));

  return (
    <Card
      className={`relative p-8 rounded-lg ${
        isPopular ? 'border-2 border-primary shadow-lg' : 'border border-gray-200'
      }`}
    >
      {isPopular && (
        <Badge
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
          variant="secondary"
        >
          Le plus populaire
        </Badge>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-black mb-2">{name}</h3>
        <div className="flex justify-center items-baseline mb-2">
          <span className="text-5xl font-extrabold text-black">{formattedPrice}</span>
          {period && <span className="text-black ml-1">{period}</span>}
        </div>
        {trial && (
          <p className="text-sm text-gray-500 mb-4">{trial}</p>
        )}
      </div>

      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="h-6 w-6 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {showPayment ? (
        <>
          <CouponSection
            couponCode={couponCode}
            setCouponCode={setCouponCode}
          />
          <PaymentButtons
            planType={planType}
            couponCode={couponCode}
            onSubscribe={onSubscribe}
          />
        </>
      ) : (
        <Button
          className={`w-full mt-8 ${isCurrentPlan ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          onClick={() => setShowPayment(true)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? "Plan actuel" : "Sélectionner"}
        </Button>
      )}
    </Card>
  );
};