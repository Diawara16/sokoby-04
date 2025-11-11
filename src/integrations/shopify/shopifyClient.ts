import { createShopifyClient } from "./shopifyApi";
import type { ShopifyProduct, ShopifyOrder } from "./shopifyApi";

export interface ShopifyClientConfig {
  shop: string;
  accessToken: string;
}

// Store configuration in memory or localStorage
let clientConfig: ShopifyClientConfig | null = null;

export const initializeShopifyClient = (config: ShopifyClientConfig) => {
  clientConfig = config;
  // Optionally store in localStorage for persistence
  localStorage.setItem("shopify_config", JSON.stringify(config));
};

export const getShopifyClient = () => {
  if (!clientConfig) {
    // Try to load from localStorage
    const stored = localStorage.getItem("shopify_config");
    if (stored) {
      clientConfig = JSON.parse(stored);
    } else {
      throw new Error("Shopify client not initialized. Call initializeShopifyClient first.");
    }
  }

  return createShopifyClient(clientConfig.shop, clientConfig.accessToken);
};

export const clearShopifyClient = () => {
  clientConfig = null;
  localStorage.removeItem("shopify_config");
};

// Helper functions for common operations
export const shopifyClient = {
  // Products
  async getProducts(limit?: number) {
    const client = getShopifyClient();
    return client.getProducts(limit);
  },

  async getProduct(productId: string) {
    const client = getShopifyClient();
    return client.getProduct(productId);
  },

  async createProduct(product: Partial<ShopifyProduct>) {
    const client = getShopifyClient();
    return client.createProduct(product);
  },

  async updateProduct(productId: string, product: Partial<ShopifyProduct>) {
    const client = getShopifyClient();
    return client.updateProduct(productId, product);
  },

  async deleteProduct(productId: string) {
    const client = getShopifyClient();
    return client.deleteProduct(productId);
  },

  // Orders
  async getOrders(limit?: number) {
    const client = getShopifyClient();
    return client.getOrders(limit);
  },

  async getOrder(orderId: string) {
    const client = getShopifyClient();
    return client.getOrder(orderId);
  },

  // Shop Info
  async getShopInfo() {
    const client = getShopifyClient();
    return client.getShopInfo();
  },

  // Check if client is initialized
  isInitialized() {
    return clientConfig !== null || localStorage.getItem("shopify_config") !== null;
  },
};

export type { ShopifyProduct, ShopifyOrder };
