import { supabase } from "@/integrations/supabase/client";

export type AccessLevel = "paid" | "blocked";

export interface AccessResult {
  level: AccessLevel;
  daysLeft?: number;
  hasPaidAccess: boolean;
}

/**
 * Store-first access control.
 * Single source of truth: the `stores` table.
 *
 * IF store.plan != 'free' OR store.billing_status == 'active' → PAID
 * ELSE → BLOCKED
 */
export async function checkUserAccess(userId: string, userEmail?: string | null): Promise<AccessResult> {
  console.log("SUPABASE URL:", (supabase as any).supabaseUrl);
  console.log("[AccessControl] Checking access for user:", userId, "email:", userEmail ?? "(none)");

  const email = userEmail?.trim().toLowerCase();

  // Build OR filter: user_id or owner_email
  const orParts: string[] = [`user_id.eq.${userId}`];
  if (email) {
    orParts.push(`owner_email.eq.${email}`);
  }

  try {
    const { data: store, error } = await (supabase.from("stores") as any)
      .select("*")
      .or(orParts.join(","))
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log("STORE RESULT:", store);
    console.log("STORE QUERY ERROR:", error);
    console.log("STORE QUERY OR FILTER:", orParts.join(","));

    if (store) {
      console.log("[AccessControl] Store found:", store);

      const plan = (store.plan ?? "free").trim().toLowerCase();
      const billingStatus = (store.billing_status ?? "").trim().toLowerCase();

      if (plan !== "free" || billingStatus === "active") {
        console.log("[AccessControl] → PAID (plan=" + plan + ", billing_status=" + billingStatus + ")");
        return { level: "paid", hasPaidAccess: true };
      }
    } else {
      console.log("[AccessControl] No store found in stores table");
    }
  } catch (err) {
    console.error("[AccessControl] Store lookup exception:", err);
  }

  // Fallback: check store_settings.payment_status
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("id, payment_status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data && data.payment_status === "completed") {
      console.log("[AccessControl] → PAID (store_settings.payment_status = completed)");
      return { level: "paid", hasPaidAccess: true };
    }
  } catch {
    // continue
  }

  console.log("[AccessControl] → BLOCKED");
  return { level: "blocked", hasPaidAccess: false };
}
