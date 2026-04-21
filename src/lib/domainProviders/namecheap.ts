/**
 * Namecheap provider stub (PREP ONLY — not wired to UI).
 * Real registrar calls happen via the existing services/domains layer.
 */
export async function checkAvailability(domain: string): Promise<{ domain: string; available: boolean }> {
  // Placeholder — uses public DNS as a heuristic.
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}`);
    const data = await res.json();
    return { domain, available: !data.Answer };
  } catch {
    return { domain, available: false };
  }
}

export async function purchaseDomain(_domain: string): Promise<{ success: boolean; orderId: string | null }> {
  // No-op stub. Real purchases are NOT executed in MVP.
  return { success: false, orderId: null };
}
