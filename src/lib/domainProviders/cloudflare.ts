/**
 * Cloudflare provider stub (PREP ONLY — not wired to UI).
 */
export async function checkAvailability(domain: string): Promise<{ domain: string; available: boolean }> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}`);
    const data = await res.json();
    return { domain, available: !data.Answer };
  } catch {
    return { domain, available: false };
  }
}

export async function purchaseDomain(_domain: string): Promise<{ success: boolean; orderId: string | null }> {
  return { success: false, orderId: null };
}
