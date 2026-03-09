import { supabase } from "@/integrations/supabase/client";

export type AccessLevel = "paid" | "trial" | "blocked";

export interface AccessResult {
  level: AccessLevel;
  daysLeft?: number;
  hasPaidAccess: boolean;
}

interface StoreSnapshot {
  source: string;
  plan: string | null;
  status: string | null;
  trialEndsAt: string | null;
  hasExplicitAccessFields: boolean;
}

const isPaidPlan = (plan: string | null) => {
  if (!plan) return false;
  const normalized = plan.toLowerCase();
  return normalized !== "free" && normalized !== "trial" && normalized !== "blocked";
};

const parseStoreSnapshot = (record: any, source: string): StoreSnapshot => {
  const rawPlan = typeof record?.plan === "string" ? record.plan : null;
  const derivedPlan =
    rawPlan ??
    (record?.payment_status === "completed" ? "paid" : null) ??
    (record?.status === "active" ? "paid" : null);

  const trialEndsAt =
    (typeof record?.trial_ends_at === "string" ? record.trial_ends_at : null) ??
    (typeof record?.trial_end_date === "string" ? record.trial_end_date : null);

  const status =
    (typeof record?.status === "string" ? record.status : null) ??
    (typeof record?.store_status === "string" ? record.store_status : null) ??
    (typeof record?.payment_status === "string" ? record.payment_status : null);

  const hasExplicitAccessFields =
    record &&
    ("plan" in record ||
      "trial_ends_at" in record ||
      "trial_end_date" in record ||
      "status" in record ||
      "payment_status" in record);

  return {
    source,
    plan: derivedPlan,
    status,
    trialEndsAt,
    hasExplicitAccessFields,
  };
};

async function resolveStoreSnapshot(userId: string, userEmail?: string | null): Promise<StoreSnapshot | null> {
  const normalizedEmail = userEmail?.trim().toLowerCase();

  const tryQuery = async (label: string, runner: () => any) => {
    try {
      const { data, error } = await runner();
      if (error) {
        console.warn(`[AccessControl] ${label} query warning:`, error.message);
        return null;
      }
      return data ?? null;
    } catch (error) {
      console.warn(`[AccessControl] ${label} query failed:`, error);
      return null;
    }
  };

  const storesByUserId = await tryQuery("stores.user_id", () =>
    (supabase.from("stores") as any)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
  );
  if (storesByUserId) return parseStoreSnapshot(storesByUserId, "stores.user_id");

  if (normalizedEmail) {
    const storesByEmail = await tryQuery("stores.owner_email", () =>
      (supabase.from("stores") as any)
        .select("*")
        .eq("owner_email", normalizedEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    );
    if (storesByEmail) return parseStoreSnapshot(storesByEmail, "stores.owner_email");
  }

  const storesByOwnerId = await tryQuery("stores.owner_id", () =>
    (supabase.from("stores") as any)
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
  );
  if (storesByOwnerId) return parseStoreSnapshot(storesByOwnerId, "stores.owner_id");

  const storeSettingsByUser = await tryQuery("store_settings.user_id", () =>
    supabase
      .from("store_settings")
      .select("id, payment_status, store_status, trial_end_date")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
  );
  if (storeSettingsByUser) return parseStoreSnapshot(storeSettingsByUser, "store_settings.user_id");

  if (normalizedEmail) {
    const storeSettingsByEmail = await tryQuery("store_settings.store_email", () =>
      supabase
        .from("store_settings")
        .select("id, payment_status, store_status, trial_end_date")
        .eq("store_email", normalizedEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    );
    if (storeSettingsByEmail) return parseStoreSnapshot(storeSettingsByEmail, "store_settings.store_email");
  }

  return null;
}

/**
 * Checks user access level with strict store-first priority:
 * 1) If store plan is paid => full access
 * 2) Else if store trial_end is in future => trial access
 * 3) Else blocked
 *
 * Legacy fallbacks are kept only when no explicit store access fields are available.
 */
export async function checkUserAccess(userId: string, userEmail?: string | null): Promise<AccessResult> {
  console.log("[AccessControl] Checking access for user:", userId, "email:", userEmail ?? null);

  const storeSnapshot = await resolveStoreSnapshot(userId, userEmail);

  if (storeSnapshot) {
    console.log("[AccessControl] Store source:", storeSnapshot.source);
    console.log("[AccessControl] Store fields:", storeSnapshot.plan, storeSnapshot.trialEndsAt, storeSnapshot.status);

    if (storeSnapshot.plan === "paid" || isPaidPlan(storeSnapshot.plan)) {
      console.log("[AccessControl] → Result: PAID access granted from store record");
      return { level: "paid", hasPaidAccess: true };
    }

    if (storeSnapshot.trialEndsAt && new Date(storeSnapshot.trialEndsAt) > new Date()) {
      const daysLeft = Math.ceil(
        (new Date(storeSnapshot.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      console.log("[AccessControl] → Result: TRIAL access from store record, days left:", daysLeft);
      return { level: "trial", daysLeft, hasPaidAccess: false };
    }

    if (storeSnapshot.hasExplicitAccessFields) {
      console.log("[AccessControl] → Result: BLOCKED from store record");
      return { level: "blocked", hasPaidAccess: false };
    }
  }

  let hasPaidAccess = false;

  // Legacy fallback 1: Stripe table plan
  try {
    const { data, error } = await supabase
      .from("Stripe")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("[AccessControl] Stripe table query error:", error.message);
    } else if (data?.plan && data.plan !== "free") {
      console.log("[AccessControl] ✓ Paid via Stripe table, plan:", data.plan);
      hasPaidAccess = true;
    }
  } catch (error) {
    console.warn("[AccessControl] Stripe table check error:", error);
  }

  // Legacy fallback 2: store_settings payment_status
  if (!hasPaidAccess) {
    try {
      const { data, error } = await supabase
        .from("store_settings")
        .select("id, payment_status")
        .eq("user_id", userId)
        .eq("payment_status", "completed")
        .maybeSingle();

      if (error) {
        console.warn("[AccessControl] store_settings payment query error:", error.message);
      } else if (data) {
        console.log("[AccessControl] ✓ Paid via store_settings payment_status");
        hasPaidAccess = true;
      }
    } catch (error) {
      console.warn("[AccessControl] store_settings payment check error:", error);
    }
  }

  // Legacy fallback 3: active subscription
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
    } catch (error) {
      console.warn("[AccessControl] Subscription check error:", error);
    }
  }

  if (hasPaidAccess) {
    console.log("[AccessControl] → Result: PAID access granted (legacy fallback)");
    return { level: "paid", hasPaidAccess: true };
  }

  // Final fallback: profile trial window
  try {
    let profile: { trial_ends_at: string | null } | null = null;

    const { data: byUserId, error: byUserIdError } = await supabase
      .from("profiles")
      .select("trial_ends_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (byUserIdError) {
      console.warn("[AccessControl] Trial query (user_id) error:", byUserIdError.message);
    }

    profile = byUserId;

    if (!profile) {
      const { data: byId, error: byIdError } = await supabase
        .from("profiles")
        .select("trial_ends_at")
        .eq("id", userId)
        .maybeSingle();

      if (byIdError) {
        console.warn("[AccessControl] Trial query (id) error:", byIdError.message);
      }

      profile = byId;
    }

    const trialEndsAt = profile?.trial_ends_at;
    if (trialEndsAt && new Date(trialEndsAt) > new Date()) {
      const daysLeft = Math.ceil(
        (new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      console.log("[AccessControl] → Result: TRIAL access, days left:", daysLeft);
      return { level: "trial", daysLeft, hasPaidAccess: false };
    }
  } catch (error) {
    console.warn("[AccessControl] Trial check error:", error);
  }

  console.log("[AccessControl] → Result: BLOCKED");
  return { level: "blocked", hasPaidAccess: false };
}
