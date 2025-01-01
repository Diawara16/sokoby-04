import { differenceInDays } from "date-fns";
import { TrialStatus } from "./TrialStatus";
import { FeatureUsage } from "./FeatureUsage";
import { Recommendations } from "./Recommendations";
import { DashboardMetrics } from "./metrics/DashboardMetrics";
import { useProfileData } from "./hooks/useProfileData";
import { LoyaltyCard } from "../loyalty/LoyaltyCard";
import { ReferralCard } from "../referral/ReferralCard";
import { FlashSalesList } from "../flash-sales/FlashSalesList";
import { SalesPredictions } from "./SalesPredictions";
import { BehaviorAnalytics } from "../analytics/BehaviorAnalytics";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";
import { useTrackBehavior } from "@/hooks/useTrackBehavior";
import { useEffect } from "react";

export const UserDashboard = () => {
  const { profile, loading, cartItemsCount } = useProfileData();
  const { data: loyaltyData, isLoading: isLoadingLoyalty } = useLoyaltyPoints();
  const { trackEvent } = useTrackBehavior();

  useEffect(() => {
    trackEvent('dashboard_view', {
      timestamp: new Date().toISOString(),
    });
  }, [trackEvent]);

  if (loading || isLoadingLoyalty) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getDaysRemaining = () => {
    if (!profile?.trial_ends_at) return 0;
    return Math.max(0, differenceInDays(new Date(profile.trial_ends_at), new Date()));
  };

  const hasFeatures = profile?.features_usage ? Object.keys(profile.features_usage).length > 0 : false;
  const featuresCount = Object.keys(profile?.features_usage || {}).length;

  return (
    <div className="space-y-6">
      <TrialStatus trialEndsAt={profile?.trial_ends_at} />
      
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <DashboardMetrics 
            cartItemsCount={cartItemsCount}
            featuresCount={featuresCount}
            lastLogin={profile?.last_login}
          />
        </div>
        <div className="md:col-span-1">
          {loyaltyData && (
            <LoyaltyCard
              points={loyaltyData.points}
              lifetimePoints={loyaltyData.lifetime_points}
              tier={loyaltyData.current_tier}
              nextTierPoints={loyaltyData.nextTierPoints}
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <ReferralCard />
        </div>
        <div className="md:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <FeatureUsage features={profile?.features_usage || {}} />
            <Recommendations 
              daysRemaining={getDaysRemaining()} 
              hasFeatures={hasFeatures}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SalesPredictions />
        <BehaviorAnalytics />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Ventes Flash</h2>
        <FlashSalesList />
      </div>
    </div>
  );
};