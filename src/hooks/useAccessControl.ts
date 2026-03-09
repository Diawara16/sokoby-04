import { supabase } from "@/lib/supabase";

export type AccessLevel = "paid" | "trial" | "blocked";

export interface AccessResult {
  level: AccessLevel;
  daysLeft?: number;
  hasPaidAccess: boolean;
}

/**
 * Checks user access level. Priority order:
 * 1. Stripe table plan !== 'free' → full access (primary source of truth after payment)
 * 2. store_settings.payment_status = 'completed' → full access (one-time payment)
 * 3. Active subscription → full access
 * 4. Trial not expired → trial access
 * 5. Otherwise → blocked
 */
export async function checkUserAccess(userId: string): Promise<AccessResult> {
  console.log("[AccessControl] Checking access for user:", userId);
  let hasPaidAccess = false;

  // 1. Check Stripe table plan (fastest — set by webhook on payment)
  try {
    const { data, error } = await supabase
      .from("Stripe")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.warn("[AccessControl] Stripe table query error:", error.message);
    } else if (data && data.plan && data.plan !== "free") {
      console.log("[AccessControl] ✓ Paid via Stripe table, plan:", data.plan);
      hasPaidAccess = true;
    }
  } catch (e) {
    console.warn("[AccessControl] Stripe table check error:", e);
  }

  // 2. Check store_settings.payment_status (one-time payment)
  if (!hasPaidAccess) {
    try {
      const { data, error } = await supabase
        .from("store_settings")
        .select("id")
        .eq("user_id", userId)
        .eq("payment_status", "completed")
        .maybeSingle();
      if (error) {
        console.warn("[AccessControl] Store payment query error:", error.message);
      } else if (data) {
        console.log("[AccessControl] ✓ Paid via store_settings payment_status");
        hasPaidAccess = true;
      }
    } catch (e) {
      console.warn("[AccessControl] Store payment check error:", e);
    }
  }

  // 3. Check subscriptions (recurring plans)
  if (!hasPaidAccess) {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();
      if (error) {
        console.warn("[AccessControl] Subscription query error:", error.message);
      } else if (data) {
        console.log("[AccessControl] ✓ Paid via active subscription");
        hasPaidAccess = true;
      }
    } catch (e) {
      console.warn("[AccessControl] Subscription check error:", e);
    }
  }

  // Paid users are never blocked by trial expiration
  if (hasPaidAccess) {
    console.log("[AccessControl] → Result: PAID access granted");
    return { level: "paid", hasPaidAccess: true };
  }

  // 4. Check trial period (query both id and user_id for compatibility)
  try {
    let profile: { trial_ends_at: string | null } | null = null;
    const { data: p1, error: e1 } = await supabase
      .from("profiles")
      .select("trial_ends_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (e1) {
      console.warn("[AccessControl] Trial query (user_id) error:", e1.message);
    }
    profile = p1;
    if (!profile) {
      const { data: p2, error: e2 } = await supabase
        .from("profiles")
        .select("trial_ends_at")
        .eq("id", userId)
        .maybeSingle();
      if (e2) console.warn("[AccessControl] Trial query (id) error:", e2.message);
      profile = p2;
    }

    if (error) {
      console.warn("[AccessControl] Trial query error:", error.message);
    } else {
      const trialEndsAt = profile?.trial_ends_at;
      if (trialEndsAt && new Date(trialEndsAt) > new Date()) {
        const daysLeft = Math.ceil(
          (new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        console.log("[AccessControl] → Result: TRIAL access, days left:", daysLeft);
        return { level: "trial", daysLeft, hasPaidAccess: false };
      }
    }
  } catch (e) {
    console.warn("[AccessControl] Trial check error:", e);
  }

  console.log("[AccessControl] → Result: BLOCKED (no paid access, trial expired or missing)");
  return { level: "blocked", hasPaidAccess: false };
}
