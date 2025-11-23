import { useState } from "react";
import { PricingPlan } from "@/components/pricing/PricingPlan";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { getMonthlyPlans, getAnnualPlans } from "./pricingData";

interface PricingPlansProps {
  currentLanguage: string;
  onSubscribe: (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay',
    couponCode?: string,
    billingPeriod?: 'monthly' | 'annual'
  ) => void;
}

export const PricingPlans = ({ currentLanguage, onSubscribe }: PricingPlansProps) => {
  const [isAnnual, setIsAnnual] = useState(false);
  
  const monthlyPlans = getMonthlyPlans();
  const plans = isAnnual ? getAnnualPlans(monthlyPlans) : monthlyPlans;

  return (
    <div className="space-y-6 sm:space-y-8">
      <BillingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {plans.map((plan) => (
          <PricingPlan
            key={plan.name}
            {...plan}
            onSubscribe={(planType, paymentMethod, couponCode) => 
              onSubscribe(planType, paymentMethod, couponCode, isAnnual ? 'annual' : 'monthly')
            }
            isAuthenticated={false}
            planType={plan.planType}
            onSelect={() => {}}
          />
        ))}
      </div>
    </div>
  );
};