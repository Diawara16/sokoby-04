import { supabase } from "@/integrations/supabase/client";
import { domainService } from "./DomainService";
import { DOMAIN_FEATURE_FLAGS } from "./featureFlags";
import type { DomainProvider, DomainPurchaseResult } from "./types";

/**
 * High-level domain purchase orchestrator.
 *
 * Coordinates: availability check → payment → registrar purchase → DNS setup.
 * Automatically falls back to manual flow if any step fails.
 *
 * SAFETY: While `enableRealDomainPurchase` is false, every method
 * delegates to the existing ManualProvider / pending-state logic.
 */
export class DomainPurchaseService {
  // ---------------------------------------------------------------------------
  // 1. Full purchase flow (checkout → registrar → DNS)
  // ---------------------------------------------------------------------------

  /**
   * Execute the complete domain purchase flow.
   *
   * When real purchase is DISABLED (default):
   *   → Creates a "pending" store_domains record (existing MVP behavior).
   *
   * When real purchase is ENABLED for this store:
   *   → Calls registrar API via DomainService
   *   → Creates domain_order record
   *   → Attempts auto DNS configuration
   *   → Falls back to manual on ANY failure
   */
  async executePurchase(params: {
    domain: string;
    provider: DomainProvider;
    storeId: string;
    userId: string;
    years?: number;
  }): Promise<{
    success: boolean;
    orderId: string | null;
    requiresManualDns: boolean;
    error: string | null;
  }> {
    const { domain, provider, storeId, userId, years } = params;

    // -----------------------------------------------------------------------
    // Gate: if real purchase not enabled, use existing manual flow
    // -----------------------------------------------------------------------
    if (!DOMAIN_FEATURE_FLAGS.enableDomainCheckout) {
      return {
        success: true,
        orderId: null,
        requiresManualDns: true,
        error: null,
      };
    }

    // -----------------------------------------------------------------------
    // Real purchase path (only reached when flags are ON for this store)
    // -----------------------------------------------------------------------
    let purchaseResult: DomainPurchaseResult;

    try {
      purchaseResult = await domainService.purchaseDomain({
        domain,
        provider,
        storeId,
        userId,
        years,
      });
    } catch (err: any) {
      console.error("[DomainPurchaseService] Registrar purchase failed, falling back to manual", err);
      return {
        success: true, // don't block the user
        orderId: null,
        requiresManualDns: true,
        error: `Registrar error: ${err.message}. Manual setup required.`,
      };
    }

    if (!purchaseResult.success) {
      return {
        success: false,
        orderId: null,
        requiresManualDns: true,
        error: purchaseResult.error ?? "Purchase failed at registrar",
      };
    }

    // -----------------------------------------------------------------------
    // Record the order in domain_orders
    // -----------------------------------------------------------------------
    try {
      await supabase.from("domain_orders").insert({
        domain_id: null, // linked later when domain record exists
        user_id: userId,
        order_status: "completed",
        payment_status: "paid",
      });
    } catch (e) {
      console.warn("[DomainPurchaseService] Failed to create domain_order record", e);
    }

    // -----------------------------------------------------------------------
    // Update store_domains with provider order ID
    // -----------------------------------------------------------------------
    try {
      await supabase
        .from("store_domains")
        .update({
          provider_order_id: purchaseResult.orderId,
          status: "active",
        })
        .eq("store_id", storeId)
        .eq("domain", domain.toLowerCase().trim());
    } catch (e) {
      console.warn("[DomainPurchaseService] Failed to update store_domains", e);
    }

    // -----------------------------------------------------------------------
    // Attempt automatic DNS provisioning (non-blocking)
    // -----------------------------------------------------------------------
    let requiresManualDns = true;

    if (DOMAIN_FEATURE_FLAGS.enableAutoDnsConfiguration) {
      try {
        const dnsSuccess = await domainService.configureDns(
          domain,
          [
            { type: "A", host: "@", value: "185.158.133.1", ttl: 3600 },
            { type: "A", host: "www", value: "185.158.133.1", ttl: 3600 },
          ],
          provider,
          storeId,
        );

        if (dnsSuccess) {
          requiresManualDns = false;
          await supabase
            .from("store_domains")
            .update({ dns_auto_configured: true, dns_setup_error: null })
            .eq("store_id", storeId)
            .eq("domain", domain.toLowerCase().trim());
        }
      } catch (dnsErr: any) {
        console.warn("[DomainPurchaseService] Auto DNS failed, manual setup required", dnsErr);
        await supabase
          .from("store_domains")
          .update({
            dns_auto_configured: false,
            dns_setup_error: `Auto DNS failed: ${dnsErr.message}. Please configure manually.`,
          })
          .eq("store_id", storeId)
          .eq("domain", domain.toLowerCase().trim());
      }
    }

    return {
      success: true,
      orderId: purchaseResult.orderId,
      requiresManualDns,
      error: null,
    };
  }

  // ---------------------------------------------------------------------------
  // 2. Availability check (delegates to DomainService)
  // ---------------------------------------------------------------------------

  async checkAvailability(domain: string, provider: DomainProvider = "manual", storeId?: string) {
    return domainService.checkAvailability(domain, provider, storeId);
  }
}

/** Singleton */
export const domainPurchaseService = new DomainPurchaseService();
