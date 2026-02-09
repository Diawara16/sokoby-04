import { supabase } from "@/lib/supabase";

export type AccessLevel = "paid" | "trial" | "blocked";

export interface AccessResult {
  level: AccessLevel;
  daysLeft?: number;
  hasPaidAccess: boolean;
}

/**
 * Checks user access level. Priority order:
 * 1. Active subscription → full access
 * 2. store_settings.payment_status = 'completed' → full access (one-time payment)
 * 3. Stripe.plan !== 'free' → full access
 * 4. Trial not expired → trial access
 * 5. Otherwise → blocked
 */
export async function checkUserAccess(userId: string): Promise<AccessResult> {
  let hasPaidAccess = false;

  // 1. Check subscriptions (recurring plans)
  try {
    const { data } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    if (data) hasPaidAccess = true;
  } catch (e) {
    console.warn("[AccessControl] Subscription check error:", e);
  }

  // 2. Check store_settings.payment_status (one-time payment — primary source of truth)
  if (!hasPaidAccess) {
    try {
      const { data } = await supabase
        .from("store_settings")
        .select("id")
        .eq("user_id", userId)
        .eq("payment_status", "completed")
        .maybeSingle();
      if (data) hasPaidAccess = true;
    } catch (e) {
      console.warn("[AccessControl] Store payment check error:", e);
    }
  }

  // 3. Check Stripe table plan (future-proof for plan upgrades)
  if (!hasPaidAccess) {
    try {
      const { data } = await supabase
        .from("Stripe")
        .select("plan")
        .eq("id", userId)
        .maybeSingle();
      if (data && data.plan !== "free") hasPaidAccess = true;
    } catch (e) {
      console.warn("[AccessControl] Stripe table check error:", e);
    }
  }

  // Paid users are never blocked by trial expiration
  if (hasPaidAccess) {
    return { level: "paid", hasPaidAccess: true };
  }

  // 4. Check trial period
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("trial_ends_at")
      .eq("id", userId)
      .maybeSingle();

    const trialEndsAt = profile?.trial_ends_at;
    if (trialEndsAt && new Date(trialEndsAt) > new Date()) {
      const daysLeft = Math.ceil(
        (new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return { level: "trial", daysLeft, hasPaidAccess: false };
    }
  } catch (e) {
    console.warn("[AccessControl] Trial check error:", e);
  }

  return { level: "blocked", hasPaidAccess: false };
}
