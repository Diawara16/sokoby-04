import { supabase } from "@/integrations/supabase/client";

const isMissingColumnError = (message?: string) =>
  !!message && message.includes("column") && message.includes("does not exist");

/**
 * Best-effort link between an authenticated user and pre-existing store/invite records.
 * This keeps access checks stable when stores were created before auth account creation.
 */
export async function linkAuthenticatedUserToStore(userId: string, userEmail?: string | null) {
  const normalizedEmail = userEmail?.trim().toLowerCase();

  if (!normalizedEmail) {
    return;
  }

  console.log("[AuthLink] Start", { userId, email: normalizedEmail });

  // 1) New schema: stores.user_id linked via stores.owner_email
  try {
    const { data, error } = await (supabase.from("stores") as any)
      .update({ user_id: userId })
      .eq("owner_email", normalizedEmail)
      .neq("user_id", userId)
      .select("id");

    if (error) {
      if (!isMissingColumnError(error.message)) {
        console.warn("[AuthLink] stores.owner_email -> user_id update warning:", error.message);
      }
    } else if (data?.length) {
      console.log("[AuthLink] Linked stores by owner_email -> user_id", { count: data.length });
    }
  } catch (error) {
    console.warn("[AuthLink] stores.user_id linking error:", error);
  }

  // 2) Legacy schema: stores.owner_id (uuid) without user_id column
  try {
    const { data, error } = await (supabase.from("stores") as any)
      .update({ owner_id: userId })
      .eq("owner_email", normalizedEmail)
      .neq("owner_id", userId)
      .select("id");

    if (error) {
      if (!isMissingColumnError(error.message)) {
        console.warn("[AuthLink] stores.owner_email -> owner_id update warning:", error.message);
      }
    } else if (data?.length) {
      console.log("[AuthLink] Linked stores by owner_email -> owner_id", { count: data.length });
    }
  } catch (error) {
    console.warn("[AuthLink] stores.owner_id linking error:", error);
  }

  // 3) Link existing store_settings rows by email if needed
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .update({ user_id: userId })
      .eq("store_email", normalizedEmail)
      .neq("user_id", userId)
      .select("id");

    if (error) {
      console.warn("[AuthLink] store_settings.store_email -> user_id update warning:", error.message);
    } else if (data?.length) {
      console.log("[AuthLink] Linked store_settings by store_email", { count: data.length });
    }
  } catch (error) {
    console.warn("[AuthLink] store_settings linking error:", error);
  }

  // 4) Invite acceptance bridge: assign pending staff invitation to this auth user
  try {
    const { data, error } = await supabase
      .from("staff_members")
      .update({
        user_id: userId,
        status: "active",
        joined_at: new Date().toISOString(),
      })
      .eq("email", normalizedEmail)
      .eq("status", "pending")
      .neq("user_id", userId)
      .select("id");

    if (error) {
      console.warn("[AuthLink] staff invite linking warning:", error.message);
    } else if (data?.length) {
      console.log("[AuthLink] Linked pending staff invites", { count: data.length });
    }
  } catch (error) {
    console.warn("[AuthLink] staff invite linking error:", error);
  }
}
