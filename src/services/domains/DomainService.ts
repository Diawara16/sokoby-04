import { DOMAIN_FEATURE_FLAGS, isRealProviderEnabledForStore } from "./featureFlags";
import type {
  DomainProvider,
  DomainProviderAdapter,
  DomainAvailabilityResult,
  DomainPurchaseRequest,
  DomainPurchaseResult,
  DnsRecord,
} from "./types";
import { ManualProvider } from "./providers/ManualProvider";
import { NamecheapProvider } from "./providers/NamecheapProvider";
import { CloudflareProvider } from "./providers/CloudflareProvider";

/**
 * Central domain service — resolves the correct provider adapter
 * based on feature flags AND per-store rollout status.
 *
 * SAFETY GUARANTEES:
 * - While master flag is off → every call uses ManualProvider.
 * - If a real provider throws → automatic fallback to ManualProvider.
 * - Rollback: set `enableRealDomainPurchase = false` → instant full rollback.
 */
export class DomainService {
  private manual = new ManualProvider();
  private namecheap = new NamecheapProvider();
  private cloudflare = new CloudflareProvider();

  // -----------------------------------------------------------------------
  // Provider resolution
  // -----------------------------------------------------------------------

  /**
   * Resolve the provider adapter for a given store.
   * Returns ManualProvider unless both the master flag AND per-store
   * rollout allow real provider usage.
   */
  private resolve(provider: DomainProvider, storeId?: string): DomainProviderAdapter {
    if (!DOMAIN_FEATURE_FLAGS.enableRealDomainPurchase) {
      return this.manual;
    }
    if (storeId && !isRealProviderEnabledForStore(storeId)) {
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

  // -----------------------------------------------------------------------
  // Public API — every method includes automatic fallback
  // -----------------------------------------------------------------------

  async checkAvailability(
    domain: string,
    provider: DomainProvider = "manual",
    storeId?: string,
  ): Promise<DomainAvailabilityResult> {
    if (!DOMAIN_FEATURE_FLAGS.enableRegistrarAvailabilityCheck) {
      return this.manual.checkAvailability(domain);
    }

    const adapter = this.resolve(provider, storeId);
    if (adapter === this.manual) {
      return this.manual.checkAvailability(domain);
    }

    // Attempt real provider with automatic fallback
    try {
      return await adapter.checkAvailability(domain);
    } catch (err) {
      console.warn(
        `[DomainService] ${adapter.name} availability check failed, falling back to ManualProvider`,
        err,
      );
      return this.manual.checkAvailability(domain);
    }
  }

  async purchaseDomain(request: DomainPurchaseRequest): Promise<DomainPurchaseResult> {
    if (!DOMAIN_FEATURE_FLAGS.enableDomainCheckout) {
      return this.manual.purchaseDomain(request);
    }

    const adapter = this.resolve(request.provider, request.storeId);
    if (adapter === this.manual) {
      return this.manual.purchaseDomain(request);
    }

    // Attempt real provider with automatic fallback
    try {
      return await adapter.purchaseDomain(request);
    } catch (err) {
      console.warn(
        `[DomainService] ${adapter.name} purchase failed, falling back to ManualProvider`,
        err,
      );
      return this.manual.purchaseDomain(request);
    }
  }

  async configureDns(
    domain: string,
    records: DnsRecord[],
    provider: DomainProvider = "manual",
    storeId?: string,
  ): Promise<boolean> {
    if (!DOMAIN_FEATURE_FLAGS.enableAutoDnsConfiguration) {
      return false;
    }

    const adapter = this.resolve(provider, storeId);
    if (adapter === this.manual) {
      return false;
    }

    // Attempt real provider with automatic fallback
    try {
      return await adapter.configureDns(domain, records);
    } catch (err) {
      console.warn(
        `[DomainService] ${adapter.name} DNS config failed, falling back to manual`,
        err,
      );
      return false;
    }
  }
}

/** Singleton instance */
export const domainService = new DomainService();
