/** Supported domain registrar providers */
export type DomainProvider = "namecheap" | "cloudflare" | "manual";

export interface DomainAvailabilityResult {
  domain: string;
  available: boolean;
  premium: boolean;
  price: number | null;
  currency: string;
  provider: DomainProvider;
}

export interface DomainPurchaseRequest {
  domain: string;
  provider: DomainProvider;
  storeId: string;
  userId: string;
  years?: number;
}

export interface DomainPurchaseResult {
  success: boolean;
  orderId: string | null;
  error: string | null;
  status: "pending" | "completed" | "failed";
}

export interface DnsRecord {
  type: "A" | "CNAME" | "TXT" | "MX";
  host: string;
  value: string;
  ttl: number;
}

export interface DomainProviderAdapter {
  readonly name: DomainProvider;

  checkAvailability(domain: string): Promise<DomainAvailabilityResult>;
  purchaseDomain(request: DomainPurchaseRequest): Promise<DomainPurchaseResult>;
  configureDns(domain: string, records: DnsRecord[]): Promise<boolean>;
}
