/**
 * Domain purchase feature flags.
 * Set to `true` only when registrar API integration is fully tested and ready.
 */
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
