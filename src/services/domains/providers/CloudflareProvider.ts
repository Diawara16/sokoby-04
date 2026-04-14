import type {
  DomainProviderAdapter,
  DomainAvailabilityResult,
  DomainPurchaseRequest,
  DomainPurchaseResult,
  DnsRecord,
} from "../types";

/**
 * Cloudflare Registrar adapter.
 *
 * Requires Edge Function `cloudflare-proxy` to be deployed.
 * All calls go through Supabase Edge Functions so API keys
 * never leave the server.
 *
 * SAFETY: This provider is only instantiated when
 * `enableRealDomainPurchase` AND per-store rollout allow it.
 * If any call throws, DomainService automatically falls back
 * to ManualProvider.
 */
export class CloudflareProvider implements DomainProviderAdapter {
  readonly name = "cloudflare" as const;

  private async callEdgeFunction<T>(
    functionName: string,
    body: Record<string, unknown>,
  ): Promise<T> {
    const { supabase } = await import("@/integrations/supabase/client");

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) {
      throw new Error("[CloudflareProvider] User not authenticated");
    }

    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
    });

    if (error) {
      throw new Error(`[CloudflareProvider] Edge function error: ${error.message}`);
    }

    return data as T;
  }

  async checkAvailability(domain: string): Promise<DomainAvailabilityResult> {
    const result = await this.callEdgeFunction<{
      available: boolean;
      premium: boolean;
      price: number | null;
      currency: string;
    }>("cloudflare-domain-check", { domain });

    return {
      domain,
      available: result.available,
      premium: result.premium,
      price: result.price,
      currency: result.currency ?? "USD",
      provider: "cloudflare",
    };
  }

  async purchaseDomain(request: DomainPurchaseRequest): Promise<DomainPurchaseResult> {
    const result = await this.callEdgeFunction<{
      success: boolean;
      orderId: string | null;
      error: string | null;
    }>("cloudflare-domain-purchase", {
      domain: request.domain,
      storeId: request.storeId,
      userId: request.userId,
      years: request.years ?? 1,
    });

    return {
      success: result.success,
      orderId: result.orderId,
      error: result.error,
      status: result.success ? "pending" : "failed",
    };
  }

  async configureDns(domain: string, records: DnsRecord[]): Promise<boolean> {
    const result = await this.callEdgeFunction<{ success: boolean }>(
      "cloudflare-dns-configure",
      { domain, records },
    );
    return result.success;
  }
}
