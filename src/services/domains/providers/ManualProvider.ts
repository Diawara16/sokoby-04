import type { DomainProviderAdapter, DomainAvailabilityResult, DomainPurchaseRequest, DomainPurchaseResult, DnsRecord } from "../types";

/**
 * Fallback provider — no registrar API calls.
 * Used when feature flags are off (current MVP behavior).
 */
export class ManualProvider implements DomainProviderAdapter {
  readonly name = "manual" as const;

  async checkAvailability(domain: string): Promise<DomainAvailabilityResult> {
    // Current DNS-based estimation (unchanged logic, just wrapped)
    try {
      const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const data = await res.json();
      const hasRecords = data.Answer && data.Answer.length > 0;
      return {
        domain,
        available: !hasRecords,
        premium: false,
        price: null,
        currency: "USD",
        provider: "manual",
      };
    } catch {
      return { domain, available: false, premium: false, price: null, currency: "USD", provider: "manual" };
    }
  }

  async purchaseDomain(request: DomainPurchaseRequest): Promise<DomainPurchaseResult> {
    // No real purchase — returns pending (current MVP behavior)
    return {
      success: true,
      orderId: null,
      error: null,
      status: "pending",
    };
  }

  async configureDns(_domain: string, _records: DnsRecord[]): Promise<boolean> {
    // Manual setup — always returns false (user must configure DNS themselves)
    return false;
  }
}
