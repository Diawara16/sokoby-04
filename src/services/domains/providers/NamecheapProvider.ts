import type {
  DomainProviderAdapter,
  DomainAvailabilityResult,
  DomainPurchaseRequest,
  DomainPurchaseResult,
  DnsRecord,
} from "../types";

/**
 * Namecheap registrar adapter.
 *
 * Requires Edge Function `namecheap-proxy` to be deployed.
 * All calls go through Supabase Edge Functions so API keys
 * never leave the server.
 *
 * SAFETY: This provider is only instantiated when
 * `enableRealDomainPurchase` AND per-store rollout allow it.
 * If any call throws, DomainService automatically falls back
 * to ManualProvider.
 */
export class NamecheapProvider implements DomainProviderAdapter {
  readonly name = "namecheap" as const;

  private async callEdgeFunction<T>(
    functionName: string,
    body: Record<string, unknown>,
  ): Promise<T> {
    const { supabase } = await import("@/integrations/supabase/client");

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) {
      throw new Error("[NamecheapProvider] User not authenticated");
    }

    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
    });

    if (error) {
      throw new Error(`[NamecheapProvider] Edge function error: ${error.message}`);
    }

    return data as T;
  }

  async checkAvailability(domain: string): Promise<DomainAvailabilityResult> {
    const result = await this.callEdgeFunction<{
      available: boolean;
      premium: boolean;
      price: number | null;
      currency: string;
    }>("namecheap-domain-check", { domain });

    return {
      domain,
      available: result.available,
      premium: result.premium,
      price: result.price,
      currency: result.currency ?? "USD",
      provider: "namecheap",
    };
  }

  async purchaseDomain(request: DomainPurchaseRequest): Promise<DomainPurchaseResult> {
    const result = await this.callEdgeFunction<{
      success: boolean;
      orderId: string | null;
      error: string | null;
    }>("namecheap-domain-purchase", {
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
      "namecheap-dns-configure",
      { domain, records },
    );
    return result.success;
  }
}
