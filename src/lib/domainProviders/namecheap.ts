/**
 * Namecheap provider client-side stub.
 * Real purchases NEVER happen here — they are executed by the
 * `purchase-domain-secure` Supabase Edge Function which holds the API
 * credentials and supports sandbox mode via NAMECHEAP_SANDBOX env.
 *
 * This module only provides typed helpers safe for the browser:
 *  - checkAvailability: heuristic DNS-based availability estimate
 *  - purchaseDomain: typed no-op redirecting callers to the secure flow
 */

import { supabase } from "@/integrations/supabase/client";

export interface AvailabilityResult {
  domain: string;
  available: boolean;
  source: "dns-heuristic";
}

export interface PurchaseResult {
  success: boolean;
  status: "purchased" | "failed" | "not_executed";
  orderId: string | null;
  error: string | null;
}

const TIMEOUT_MS = 8_000;

export async function checkAvailability(domain: string): Promise<AvailabilityResult> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}`, {
      signal: ctrl.signal,
    });
    const data = await res.json();
    return { domain, available: !data.Answer, source: "dns-heuristic" };
  } catch {
    return { domain, available: false, source: "dns-heuristic" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Securely complete a purchase by invoking the backend edge function.
 * The frontend never touches Namecheap credentials.
 */
export async function purchaseDomain(domainId: string, years = 1): Promise<PurchaseResult> {
  try {
    const { data, error } = await supabase.functions.invoke("purchase-domain-secure", {
      body: { domainId, years },
    });
    if (error) {
      return { success: false, status: "failed", orderId: null, error: error.message };
    }
    return {
      success: !!data?.success,
      status: data?.status ?? "failed",
      orderId: data?.orderId ?? null,
      error: data?.error ?? null,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return { success: false, status: "failed", orderId: null, error: msg };
  }
}
