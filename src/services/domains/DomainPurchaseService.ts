import { supabase } from "@/integrations/supabase/client";
import { domainService } from "./DomainService";
import { DOMAIN_FEATURE_FLAGS } from "./featureFlags";
import type { DomainProvider, DomainPurchaseResult } from "./types";

// ---------------------------------------------------------------------------
// Domain ownership verification methods
// ---------------------------------------------------------------------------
export type VerificationMethod = "dns_a" | "dns_txt";

export interface VerificationResult {
  verified: boolean;
  method: VerificationMethod;
  error: string | null;
}

export interface ConnectExternalResult {
  success: boolean;
  domainId: string | null;
  error: string | null;
}

/**
 * High-level domain purchase orchestrator.
 *
 * Provides a UNIFIED interface for:
 *   - purchaseDomain()        → internal purchase (flag-gated, currently OFF)
 *   - connectExternalDomain() → external domain connection (ACTIVE)
 *   - verifyDomainOwnership() → DNS A / TXT verification (ACTIVE)
 *
 * SAFETY: While `enableRealDomainPurchase` is false, every purchase method
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
        domain_id: null,
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
  // 2. Connect an externally purchased domain (ACTIVE)
  // ---------------------------------------------------------------------------

  /**
   * Register an external domain for connection.
   * Creates a "pending" record in the domains table and provides
   * DNS instructions for the user to configure at their registrar.
   */
  async connectExternalDomain(params: {
    domain: string;
    userId: string;
    storeId: string | null;
  }): Promise<ConnectExternalResult> {
    const { domain, userId, storeId } = params;
    const cleanDomain = domain.trim().toLowerCase();

    try {
      const { data, error } = await supabase.from("domains").insert({
        domain_name: cleanDomain,
        user_id: userId,
        store_id: storeId,
        domain_type: "external",
        status: "pending",
        ssl_status: "pending",
        is_primary: false,
      }).select("id").single();

      if (error) throw error;

      return { success: true, domainId: data.id, error: null };
    } catch (err: any) {
      console.error("[DomainPurchaseService] connectExternalDomain failed", err);
      return { success: false, domainId: null, error: err.message };
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Domain ownership verification (ACTIVE)
  // ---------------------------------------------------------------------------

  /**
   * Verify domain ownership using DNS records.
   *
   * Supports two methods:
   *   - dns_a:   checks A record → 185.158.133.1
   *   - dns_txt:  checks TXT record for _sokoby-verify.domain → expected token
   *
   * Falls back to TXT method if A record check fails when method is "dns_a".
   */
  async verifyDomainOwnership(params: {
    domain: string;
    domainId: string;
    method?: VerificationMethod;
    verificationToken?: string;
  }): Promise<VerificationResult> {
    const { domain, domainId, method = "dns_a", verificationToken } = params;

    // Try A record verification
    if (method === "dns_a") {
      const aResult = await this.verifyViaARecord(domain);
      if (aResult.verified) {
        await this.markDomainVerified(domainId, "dns_a");
        return aResult;
      }

      // Fallback to TXT if A record fails and token is provided
      if (verificationToken) {
        const txtResult = await this.verifyViaTxtRecord(domain, verificationToken);
        if (txtResult.verified) {
          await this.markDomainVerified(domainId, "dns_txt");
          return txtResult;
        }
        return {
          verified: false,
          method: "dns_a",
          error: "Le DNS ne pointe pas encore vers Sokoby (A record) et aucun enregistrement TXT de vérification trouvé.",
        };
      }

      return aResult;
    }

    // TXT-only verification
    if (method === "dns_txt" && verificationToken) {
      const txtResult = await this.verifyViaTxtRecord(domain, verificationToken);
      if (txtResult.verified) {
        await this.markDomainVerified(domainId, "dns_txt");
      }
      return txtResult;
    }

    return { verified: false, method, error: "Méthode de vérification invalide." };
  }

  // ---------------------------------------------------------------------------
  // 4. Availability check (delegates to DomainService)
  // ---------------------------------------------------------------------------

  async checkAvailability(domain: string, provider: DomainProvider = "manual", storeId?: string) {
    return domainService.checkAvailability(domain, provider, storeId);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async verifyViaARecord(domain: string): Promise<VerificationResult> {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const data = await response.json();
      const pointsToSokoby = data.Answer?.some(
        (record: any) => record.type === 1 && record.data === "185.158.133.1"
      );

      return {
        verified: !!pointsToSokoby,
        method: "dns_a",
        error: pointsToSokoby ? null : "Le DNS ne pointe pas encore vers 185.158.133.1",
      };
    } catch (err: any) {
      return { verified: false, method: "dns_a", error: `Erreur DNS: ${err.message}` };
    }
  }

  private async verifyViaTxtRecord(domain: string, expectedToken: string): Promise<VerificationResult> {
    try {
      const response = await fetch(`https://dns.google/resolve?name=_sokoby-verify.${domain}&type=TXT`);
      const data = await response.json();
      const found = data.Answer?.some(
        (record: any) => record.type === 16 && record.data?.replace(/"/g, "").trim() === expectedToken
      );

      return {
        verified: !!found,
        method: "dns_txt",
        error: found ? null : `Enregistrement TXT _sokoby-verify.${domain} introuvable ou incorrect.`,
      };
    } catch (err: any) {
      return { verified: false, method: "dns_txt", error: `Erreur DNS TXT: ${err.message}` };
    }
  }

  private async markDomainVerified(domainId: string, method: VerificationMethod): Promise<void> {
    try {
      await supabase.from("domains").update({
        status: "active",
        ssl_status: "active",
        updated_at: new Date().toISOString(),
      }).eq("id", domainId);
    } catch (e) {
      console.warn("[DomainPurchaseService] Failed to mark domain verified", e);
    }
  }
}

/** Singleton */
export const domainPurchaseService = new DomainPurchaseService();
