import type { DomainProviderAdapter, DomainAvailabilityResult, DomainPurchaseRequest, DomainPurchaseResult, DnsRecord } from "../types";

/**
 * Namecheap registrar adapter — PLACEHOLDER.
 * All methods throw until enableRealDomainPurchase is true.
 */
export class NamecheapProvider implements DomainProviderAdapter {
  readonly name = "namecheap" as const;

  async checkAvailability(_domain: string): Promise<DomainAvailabilityResult> {
    throw new Error("[NamecheapProvider] Not implemented — feature flag is off.");
  }

  async purchaseDomain(_request: DomainPurchaseRequest): Promise<DomainPurchaseResult> {
    throw new Error("[NamecheapProvider] Not implemented — feature flag is off.");
  }

  async configureDns(_domain: string, _records: DnsRecord[]): Promise<boolean> {
    throw new Error("[NamecheapProvider] Not implemented — feature flag is off.");
  }
}
