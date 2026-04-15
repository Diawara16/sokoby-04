import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import { useStoreSubscription, StoreSubscription } from "@/hooks/useStoreSubscription";

export interface TrialInfo {
  isTrial: boolean;
  isActive: boolean;
  daysRemaining: number;
  planName: string;
  planSlug: string;
  endDate: string | null;
  subscription: StoreSubscription | null;
  isLoading: boolean;
}

export const useTrialStatus = (storeId: string | null): TrialInfo => {
  const { subscription, isLoading } = useStoreSubscription(storeId);

  return useMemo(() => {
    const isTrial = subscription?.status === "trial";
    const isActive = subscription?.status === "active" || isTrial;
    const plan = subscription?.plans as any;
    const endDate = subscription?.end_date ?? null;
    const daysRemaining = isTrial && endDate
      ? Math.max(0, differenceInDays(new Date(endDate), new Date()))
      : 0;

    return {
      isTrial,
      isActive,
      daysRemaining,
      planName: plan?.name || "Free",
      planSlug: plan?.slug || "free",
      endDate,
      subscription,
      isLoading,
    };
  }, [subscription, isLoading]);
};
