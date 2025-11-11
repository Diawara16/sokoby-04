/**
 * Shopify Authentication Utilities
 * Handles authentication and API configuration for Shopify integration
 */

export interface ShopifyConfig {
  shopDomain: string;
  accessToken: string;
  apiVersion?: string;
}

export interface ShopifyAuthError {
  message: string;
  code?: string;
}

/**
 * Default Shopify API version
 */
const DEFAULT_API_VERSION = '2024-01';

/**
 * Validates Shopify shop domain format
 */
export const validateShopDomain = (domain: string): boolean => {
  const shopifyDomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/;
  return shopifyDomainRegex.test(domain);
};

/**
 * Creates Shopify API URL for GraphQL endpoint
 */
export const getShopifyGraphQLUrl = (config: ShopifyConfig): string => {
  const apiVersion = config.apiVersion || DEFAULT_API_VERSION;
  return `https://${config.shopDomain}/admin/api/${apiVersion}/graphql.json`;
};

/**
 * Creates Shopify API URL for REST endpoint
 */
export const getShopifyRestUrl = (config: ShopifyConfig, endpoint: string): string => {
  const apiVersion = config.apiVersion || DEFAULT_API_VERSION;
  return `https://${config.shopDomain}/admin/api/${apiVersion}/${endpoint}`;
};

/**
 * Creates headers for Shopify API requests
 */
export const getShopifyHeaders = (accessToken: string): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': accessToken,
  };
};

/**
 * Validates Shopify access token format
 */
export const validateAccessToken = (token: string): boolean => {
  return token.length > 0 && /^shpat_[a-zA-Z0-9]{32}$/.test(token);
};

/**
 * Test Shopify connection by making a simple API call
 */
export const testShopifyConnection = async (config: ShopifyConfig): Promise<{ success: boolean; error?: ShopifyAuthError }> => {
  try {
    const url = getShopifyGraphQLUrl(config);
    const headers = getShopifyHeaders(config.accessToken);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `{
          shop {
            name
            email
          }
        }`
      })
    });

    if (!response.ok) {
      return {
        success: false,
        error: {
          message: 'Failed to connect to Shopify',
          code: response.status.toString()
        }
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    };
  }
};
