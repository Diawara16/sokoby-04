import { supabase } from "@/integrations/supabase/client";

export type AccessLevel = "paid" | "trial" | "blocked";

export interface AccessResult {
  level: AccessLevel;
  daysLeft?: number;
  hasPaidAccess: boolean;
}

/**
 * Store-first access control.
 * Single source of truth: the `stores` table.
 *
 * Priority:
 *   1. stores.plan != 'free' → PAID
 *   2. stores.trial_ends_at > now → TRIAL
 *   3. → BLOCKED
 */
export async function checkUserAccess(userId: string, userEmail?: string | null): Promise<AccessResult> {
  console.log("[AccessControl] Checking access for user:", userId, "email:", userEmail ?? "(none)");

  const store = await resolveStore(userId, userEmail);

  if (!store) {
    console.log("[AccessControl] No store found → BLOCKED");
    return { level: "blocked", hasPaidAccess: false };
  }

  console.log("[AccessControl] Store resolved:", {
    id: store.id,
    plan: store.plan,
    status: store.status,
    billing_status: store.billing_status,
    trial_ends_at: store.trial_ends_at,
    payment_status: store.payment_status,
  });

  // Rule 1: plan != 'free' → always paid access
  const plan = (store.plan ?? "free").trim().toLowerCase();
  if (plan !== "free") {
    console.log("[AccessControl] → PAID (stores.plan =", store.plan, ")");
    return { level: "paid", hasPaidAccess: true };
  }

  // Also check store_settings payment_status as fallback
  if (store.payment_status === "completed") {
    console.log("[AccessControl] → PAID (payment_status = completed)");
    return { level: "paid", hasPaidAccess: true };
  }

  // Rule 2: active trial
  if (store.trial_ends_at) {
    const trialEnd = new Date(store.trial_ends_at).getTime();
    if (!Number.isNaN(trialEnd) && trialEnd > Date.now()) {
      const daysLeft = Math.max(0, Math.ceil((trialEnd - Date.now()) / (1000 * 60 * 60 * 24)));
      console.log("[AccessControl] → TRIAL, days left:", daysLeft);
      return { level: "trial", daysLeft, hasPaidAccess: false };
    }
  }

  // Rule 3: blocked
  console.log("[AccessControl] → BLOCKED");
  return { level: "blocked", hasPaidAccess: false };
}

// ---- internal helpers ----

interface StoreRecord {
  id: string;
  plan: string | null;
  status: string | null;
  trial_ends_at: string | null;
  billing_status: string | null;
  payment_status: string | null;
}

async function resolveStore(userId: string, userEmail?: string | null): Promise<StoreRecord | null> {
  const email = userEmail?.trim().toLowerCase();

  // Try stores table first (user_id, then owner_id, then owner_email)
  for (const { field, value } of [
    { field: "user_id", value: userId },
    { field: "owner_id", value: userId },
    ...(email ? [{ field: "owner_email", value: email }] : []),
  ]) {
    try {
      const { data, error } = await (supabase.from("stores") as any)
        .select("id, plan, status, trial_ends_at, billing_status")
        .eq(field, value)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        console.log("[AccessControl] Found store via stores." + field);
        return { ...data, payment_status: null };
      }
    } catch {
      // continue to next lookup
    }
  }

  // Fallback: check store_settings.payment_status
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("id, payment_status, store_status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      console.log("[AccessControl] Found store via store_settings");
      return {
        id: data.id,
        plan: data.payment_status === "completed" ? "paid" : "free",
        status: data.store_status,
        trial_ends_at: null,
        billing_status: null,
        payment_status: data.payment_status,
      };
    }
  } catch {
    // continue
  }

  return null;
}
