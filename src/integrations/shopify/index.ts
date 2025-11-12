// Shopify Integration Barrel Export
// Import and re-export everything from shopify modules

// Client (simplified interface)
export {
  initializeShopifyClient,
  getShopifyClient,
  clearShopifyClient,
  shopifyClient,
  type ShopifyClientConfig,
} from "./shopifyClient";

// API (core client and types)
export {
  createShopifyClient,
  type ShopifyProduct,
  type ShopifyImage,
  type ShopifyVariant,
  type ShopifyOption,
  type ShopifyOrder,
  type ShopifyLineItem,
} from "./shopifyApi";

// Auth
export {
  getShopifyAuthUrl,
  exchangeShopifyToken,
} from "./shopifyAuth";

// Service Layer (higher-level business operations)
export {
  shopifyService,
  shopifyProductService,
  shopifyOrderService,
  shopifyInventoryService,
  shopifyShopService,
  ShopifyServiceError,
} from "./shopifyService";
