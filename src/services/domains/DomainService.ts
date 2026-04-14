import { DOMAIN_FEATURE_FLAGS } from "./featureFlags";
import type { DomainProvider, DomainProviderAdapter, DomainAvailabilityResult, DomainPurchaseRequest, DomainPurchaseResult, DnsRecord } from "./types";
import { ManualProvider } from "./providers/ManualProvider";
import { NamecheapProvider } from "./providers/NamecheapProvider";
import { CloudflareProvider } from "./providers/CloudflareProvider";

/**
 * Central domain service — resolves the correct provider adapter
 * based on feature flags. While flags are off, every call falls
 * back to ManualProvider (current MVP behavior).
 */
export class DomainService {
  private manual = new ManualProvider();
  private namecheap = new NamecheapProvider();
  private cloudflare = new CloudflareProvider();

  private resolve(provider: DomainProvider): DomainProviderAdapter {
    if (!DOMAIN_FEATURE_FLAGS.enableRealDomainPurchase) {
      return this.manual;
    }
    switch (provider) {
      case "namecheap":
        return this.namecheap;
      case "cloudflare":
        return this.cloudflare;
      default:
        return this.manual;
    }
  }

  async checkAvailability(domain: string, provider: DomainProvider = "manual"): Promise<DomainAvailabilityResult> {
    const adapter = DOMAIN_FEATURE_FLAGS.enableRegistrarAvailabilityCheck
      ? this.resolve(provider)
      : this.manual;
    return adapter.checkAvailability(domain);
  }

  async purchaseDomain(request: DomainPurchaseRequest): Promise<DomainPurchaseResult> {
    if (!DOMAIN_FEATURE_FLAGS.enableDomainCheckout) {
      return this.manual.purchaseDomain(request);
    }
    return this.resolve(request.provider).purchaseDomain(request);
  }

  async configureDns(domain: string, records: DnsRecord[], provider: DomainProvider = "manual"): Promise<boolean> {
    if (!DOMAIN_FEATURE_FLAGS.enableAutoDnsConfiguration) {
      return false;
    }
    return this.resolve(provider).configureDns(domain, records);
  }
}

/** Singleton instance */
export const domainService = new DomainService();
