// Shared Namecheap pricing helpers used by both the public
// `namecheap-domain-check` edge function and `purchase-domain-secure`
// re-verification step.
//
// Two things are surfaced:
//   1. checkAvailabilityAndPrice(domain) — single call to namecheap.domains.check.
//      For premium domains, Namecheap returns PremiumRegistrationPrice inline.
//   2. getStandardTldPrice(tld) — calls namecheap.users.getPricing for the
//      register action of a single TLD. Cached in-memory for the lifetime of
//      the edge isolate to keep latency low.

import { buildNamecheapRequest } from "./namecheap-relay.ts";

export interface DomainQuote {
  domain: string;
  available: boolean;
  premium: boolean;
  /** Registrar wholesale price in USD (what Namecheap will charge us). */
  price: number | null;
  currency: "USD";
  source: "namecheap.check.premium" | "namecheap.users.getPricing" | "unavailable";
}

const pricingCache = new Map<string, { price: number; ts: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1h

function namecheapBaseParams(): Record<string, string> {
  const apiUser = Deno.env.get("NAMECHEAP_API_USER");
  const apiKey = Deno.env.get("NAMECHEAP_API_KEY");
  const userName = Deno.env.get("NAMECHEAP_USERNAME") || apiUser;
  const clientIp = Deno.env.get("NAMECHEAP_CLIENT_IP") || "0.0.0.0";
  if (!apiUser || !apiKey || !userName) {
    throw new Error("Namecheap credentials not configured");
  }
  return {
    ApiUser: apiUser,
    ApiKey: apiKey,
    UserName: userName,
    ClientIp: clientIp,
  };
}

async function fetchXml(params: Record<string, string>): Promise<string> {
  const { url, init } = buildNamecheapRequest(params);
  // Diagnostic: log non-secret transport info
  const safeUrl = url.replace(/ApiKey=[^&]+/i, "ApiKey=***");
  console.log("[namecheap] fetch", {
    safeUrl,
    sandbox: Deno.env.get("NAMECHEAP_SANDBOX"),
    hasApiUser: !!Deno.env.get("NAMECHEAP_API_USER"),
    hasApiKey: !!Deno.env.get("NAMECHEAP_API_KEY"),
    hasUserName: !!Deno.env.get("NAMECHEAP_USERNAME"),
    hasClientIp: !!Deno.env.get("NAMECHEAP_CLIENT_IP"),
    hasRelayUrl: !!Deno.env.get("NAMECHEAP_RELAY_URL"),
    hasRelayToken: !!Deno.env.get("NAMECHEAP_RELAY_TOKEN"),
  });
  const res = await fetch(url, init);
  const text = await res.text();
  console.log("[namecheap] response", {
    status: res.status,
    bodyHead: text.slice(0, 400),
  });
  return text;
}

/**
 * Look up the standard registration price for a single TLD.
 * Picks the cheapest 1-year tier (Duration=1) for ProductCategory=DOMAINS
 * / ActionName=REGISTER.
 */
export async function getStandardTldPrice(tld: string): Promise<number | null> {
  const key = tld.toLowerCase();
  const cached = pricingCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.price;

  const params = {
    ...namecheapBaseParams(),
    Command: "namecheap.users.getPricing",
    ProductType: "DOMAIN",
    ProductCategory: "DOMAINS",
    ActionName: "REGISTER",
    ProductName: key,
  };

  const xml = await fetchXml(params);
  // Find all Price entries for Duration=1 and pick the lowest non-zero one.
  // Example fragment:
  //   <Product Name="com"><Price Duration="1" ... Price="9.06" RegularPrice="9.06" YourPrice="9.06"/></Product>
  const productMatch = xml.match(
    new RegExp(`<Product\\s+Name="${key}"[\\s\\S]*?</Product>`, "i"),
  );
  if (!productMatch) return null;

  const prices = [...productMatch[0].matchAll(
    /<Price\s[^>]*Duration="1"[^>]*\bPrice="([\d.]+)"/gi,
  )].map((m) => parseFloat(m[1])).filter((n) => !isNaN(n) && n > 0);

  if (prices.length === 0) return null;
  const price = Math.min(...prices);
  pricingCache.set(key, { price, ts: Date.now() });
  return price;
}

/**
 * Single source of truth for "is it available + how much does the registrar charge".
 * Calls namecheap.domains.check, and for non-premium domains follows up with
 * getStandardTldPrice() to surface the real wholesale price.
 */
export async function checkAvailabilityAndPrice(domain: string): Promise<DomainQuote> {
  const params = {
    ...namecheapBaseParams(),
    Command: "namecheap.domains.check",
    DomainList: domain,
  };
  const xml = await fetchXml(params);

  const availableMatch = xml.match(/Available="(true|false)"/i);
  const premiumMatch = xml.match(/IsPremiumName="(true|false)"/i);
  const premiumPriceMatch = xml.match(/PremiumRegistrationPrice="([\d.]+)"/i);

  const available = availableMatch?.[1]?.toLowerCase() === "true";
  const premium = premiumMatch?.[1]?.toLowerCase() === "true";

  if (!available) {
    return { domain, available: false, premium, price: null, currency: "USD", source: "unavailable" };
  }

  if (premium) {
    const price = premiumPriceMatch ? parseFloat(premiumPriceMatch[1]) : null;
    return {
      domain,
      available: true,
      premium: true,
      price: price && price > 0 ? price : null,
      currency: "USD",
      source: "namecheap.check.premium",
    };
  }

  const tld = domain.split(".").slice(1).join(".");
  const price = await getStandardTldPrice(tld);
  return {
    domain,
    available: true,
    premium: false,
    price,
    currency: "USD",
    source: "namecheap.users.getPricing",
  };
}
