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
}

const isPaidPlan = (plan: string | null) => plan?.trim().toLowerCase() === "paid";

const toTimestamp = (value: string | null) => {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const isTrialActive = (trialEndsAt: string | null) => toTimestamp(trialEndsAt) > Date.now();

const getDaysLeft = (trialEndsAt: string) =>
  Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

const parseStoreSnapshot = (record: any, source: string): StoreSnapshot => ({
  source,
  plan: typeof record?.plan === "string" ? record.plan : null,
  status: typeof record?.status === "string" ? record.status : null,
  trialEndsAt: typeof record?.trial_ends_at === "string" ? record.trial_ends_at : null,
});

const pickBestStoreSnapshot = (records: any[] | null, source: string): StoreSnapshot | null => {
  if (!records?.length) return null;

  const snapshots = records.map((record) => parseStoreSnapshot(record, source));

  snapshots.sort((a, b) => {
    const rank = (snapshot: StoreSnapshot) => {
      if (isPaidPlan(snapshot.plan)) return 0;
      if (isTrialActive(snapshot.trialEndsAt)) return 1;
      return 2;
    };

    const rankDiff = rank(a) - rank(b);
    if (rankDiff !== 0) return rankDiff;

    return toTimestamp(b.trialEndsAt) - toTimestamp(a.trialEndsAt);
  });

  return snapshots[0] ?? null;
};

async function resolveStoreSnapshot(userId: string, userEmail?: string | null): Promise<StoreSnapshot | null> {
  const normalizedEmail = userEmail?.trim().toLowerCase();

  const tryQuery = async (label: string, runner: () => Promise<{ data: any; error: any }>) => {
    try {
      const { data, error } = await runner();
      if (error) {
        console.warn(`[AccessControl] ${label} query warning:`, error.message);
        return null;
      }
      return (Array.isArray(data) ? data : data ? [data] : null) as any[] | null;
    } catch (error) {
      console.warn(`[AccessControl] ${label} query failed:`, error);
      return null;
    }
  };

  const storesByUserId = await tryQuery("stores.user_id", () =>
    (supabase.from("stores") as any)
      .select("id, plan, status, trial_ends_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
  );
  const byUserIdSnapshot = pickBestStoreSnapshot(storesByUserId, "stores.user_id");
  if (byUserIdSnapshot) return byUserIdSnapshot;

  if (normalizedEmail) {
    const storesByEmail = await tryQuery("stores.owner_email", () =>
      (supabase.from("stores") as any)
        .select("id, plan, status, trial_ends_at, created_at")
        .eq("owner_email", normalizedEmail)
        .order("created_at", { ascending: false })
    );
    const byEmailSnapshot = pickBestStoreSnapshot(storesByEmail, "stores.owner_email");
    if (byEmailSnapshot) return byEmailSnapshot;
  }

  const storesByOwnerId = await tryQuery("stores.owner_id", () =>
    (supabase.from("stores") as any)
      .select("id, plan, status, trial_ends_at, created_at")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
  );

  return pickBestStoreSnapshot(storesByOwnerId, "stores.owner_id");
}

/**
 * Store-first access policy:
 * 1) If store plan is paid => full access
 * 2) Else if store trial_end is in future => trial access
 * 3) Else blocked
 */
export async function checkUserAccess(userId: string, userEmail?: string | null): Promise<AccessResult> {
  console.log("[AccessControl] Checking access for user:", userId, "email:", userEmail ?? null);

  const storeSnapshot = await resolveStoreSnapshot(userId, userEmail);

  if (!storeSnapshot) {
    console.log("[AccessControl] No store found in stores table → Result: BLOCKED");
    return { level: "blocked", hasPaidAccess: false };
  }

  console.log("[AccessControl] Store source:", storeSnapshot.source);
  console.log("[AccessControl] Store fields:", storeSnapshot.plan, storeSnapshot.trialEndsAt, storeSnapshot.status);

  if (isPaidPlan(storeSnapshot.plan)) {
    console.log("[AccessControl] → Result: PAID access granted from stores.plan");
    return { level: "paid", hasPaidAccess: true };
  }

  if (storeSnapshot.trialEndsAt && isTrialActive(storeSnapshot.trialEndsAt)) {
    const daysLeft = getDaysLeft(storeSnapshot.trialEndsAt);
    console.log("[AccessControl] → Result: TRIAL access from stores.trial_ends_at, days left:", daysLeft);
    return { level: "trial", daysLeft, hasPaidAccess: false };
  }

  console.log("[AccessControl] → Result: BLOCKED from stores record");
  return { level: "blocked", hasPaidAccess: false };
}
