/**
 * Domain purchase feature flags & gradual rollout configuration.
 *
 * SAFETY: All real registrar interactions are gated behind these flags.
 * In production, every flag defaults to `false` — no real API calls
 * will be made until explicitly enabled.
 */

// ---------------------------------------------------------------------------
// 1. Master feature flags (static, compile-time)
// ---------------------------------------------------------------------------
export const DOMAIN_FEATURE_FLAGS = {
  /** Master switch — gates all real registrar interactions */
  enableRealDomainPurchase: false,

  /** Enable real availability checks via registrar API instead of DNS lookup */
  enableRegistrarAvailabilityCheck: false,

  /** Enable real checkout / payment flow for domain purchases */
  enableDomainCheckout: false,

  /** Enable automatic DNS configuration via registrar API */
  enableAutoDnsConfiguration: false,
} as const;

// ---------------------------------------------------------------------------
// 2. Gradual rollout — per-store opt-in list
// ---------------------------------------------------------------------------

/**
 * Stores explicitly opted-in to real domain purchasing.
 * When `enableRealDomainPurchase` is true AND a store's ID appears here,
 * the real provider path is used. All other stores stay on ManualProvider.
 *
 * Set to `null` to enable for ALL stores (full rollout).
 */
export const ROLLOUT_STORE_ALLOWLIST: string[] | null = [];

/**
 * Percentage-based rollout (0–100). Only evaluated when
 * `ROLLOUT_STORE_ALLOWLIST` is `null` (i.e. allowlist disabled).
 * A deterministic hash of the store ID is compared against this
 * threshold so the same store always gets the same result.
 */
export const ROLLOUT_PERCENTAGE = 0;

// ---------------------------------------------------------------------------
// 3. Rollout helpers
// ---------------------------------------------------------------------------

/**
 * Determines whether a specific store should use real registrar providers.
 *
 * Decision order:
 *   1. If master flag is off → false (ManualProvider).
 *   2. If allowlist is non-null and non-empty → store must be in the list.
 *   3. If allowlist is null → percentage-based rollout via deterministic hash.
 */
export function isRealProviderEnabledForStore(storeId: string): boolean {
  if (!DOMAIN_FEATURE_FLAGS.enableRealDomainPurchase) {
    return false;
  }

  // Explicit allowlist takes priority
  if (ROLLOUT_STORE_ALLOWLIST !== null) {
    return ROLLOUT_STORE_ALLOWLIST.includes(storeId);
  }

  // Percentage rollout — deterministic hash so result is stable per store
  if (ROLLOUT_PERCENTAGE <= 0) return false;
  if (ROLLOUT_PERCENTAGE >= 100) return true;

  const hash = simpleHash(storeId);
  return (hash % 100) < ROLLOUT_PERCENTAGE;
}

/** Simple deterministic numeric hash (djb2) */
function simpleHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}
