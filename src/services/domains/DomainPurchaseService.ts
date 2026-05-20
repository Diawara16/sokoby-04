import { supabase } from "@/integrations/supabase/client";
import { domainService } from "./DomainService";
import type { DomainProvider } from "./types";

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
 * High-level domain orchestrator.
 *
 * NOTE: The legacy `executePurchase()` flow was removed because it wrote
 * purchase lifecycle state (`status: "active"`, `provider_order_id`) into
 * `public.store_domains`, violating the purchase/DNS lifecycle isolation
 * contract. All purchase lifecycle reads/writes now go through
 * `useDomainPurchases` + `purchase-domain-secure` and operate exclusively
 * on `public.domain_purchases`.
 *
 * This service is retained only for:
 *   - connectExternalDomain()  → writes to `domains` (external connection)
 *   - verifyDomainOwnership()  → DNS A / TXT verification
 *   - checkAvailability()      → registrar availability lookup
 *
 * It does NOT touch `public.store_domains` (DNS connection lifecycle) nor
 * `public.domain_purchases` (purchase lifecycle).
 */
export class DomainPurchaseService {

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
