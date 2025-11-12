import { shopifyClient, type ShopifyProduct, type ShopifyOrder } from "./shopifyClient";

export class ShopifyServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ShopifyServiceError";
  }
}

// Product Operations
export const shopifyProductService = {
  async getAllProducts() {
    try {
      const response = await shopifyClient.getProducts();
      return response.products;
    } catch (error) {
      throw new ShopifyServiceError(
        "Failed to fetch products",
        "FETCH_PRODUCTS_ERROR",
        error
      );
    }
  },

  async getProductById(productId: string) {
    try {
      const response = await shopifyClient.getProduct(productId);
      return response.product;
    } catch (error) {
      throw new ShopifyServiceError(
        `Failed to fetch product ${productId}`,
        "FETCH_PRODUCT_ERROR",
        error
      );
    }
  },

  async createProduct(productData: {
    title: string;
    description?: string;
    vendor?: string;
    product_type?: string;
    price?: string;
    inventory_quantity?: number;
  }) {
    try {
      const product: Partial<ShopifyProduct> = {
        title: productData.title,
        description: productData.description,
        vendor: productData.vendor,
        product_type: productData.product_type,
        variants: productData.price ? [{
          price: productData.price,
          inventory_quantity: productData.inventory_quantity || 0,
        } as any] : [],
      };

      const response = await shopifyClient.createProduct(product);
      return response.product;
    } catch (error) {
      throw new ShopifyServiceError(
        "Failed to create product",
        "CREATE_PRODUCT_ERROR",
        error
      );
    }
  },

  async updateProduct(productId: string, updates: Partial<ShopifyProduct>) {
    try {
      const response = await shopifyClient.updateProduct(productId, updates);
      return response.product;
    } catch (error) {
      throw new ShopifyServiceError(
        `Failed to update product ${productId}`,
        "UPDATE_PRODUCT_ERROR",
        error
      );
    }
  },

  async deleteProduct(productId: string) {
    try {
      await shopifyClient.deleteProduct(productId);
      return { success: true, productId };
    } catch (error) {
      throw new ShopifyServiceError(
        `Failed to delete product ${productId}`,
        "DELETE_PRODUCT_ERROR",
        error
      );
    }
  },

  async getProductsByType(productType: string) {
    try {
      const products = await this.getAllProducts();
      return products.filter(p => p.product_type === productType);
    } catch (error) {
      throw new ShopifyServiceError(
        `Failed to fetch products by type ${productType}`,
        "FETCH_PRODUCTS_BY_TYPE_ERROR",
        error
      );
    }
  },

  async getProductsByVendor(vendor: string) {
    try {
      const products = await this.getAllProducts();
      return products.filter(p => p.vendor === vendor);
    } catch (error) {
      throw new ShopifyServiceError(
        `Failed to fetch products by vendor ${vendor}`,
        "FETCH_PRODUCTS_BY_VENDOR_ERROR",
        error
      );
    }
  },

  async searchProducts(query: string) {
    try {
      const products = await this.getAllProducts();
      const lowerQuery = query.toLowerCase();
      return products.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      throw new ShopifyServiceError(
        `Failed to search products with query "${query}"`,
        "SEARCH_PRODUCTS_ERROR",
        error
      );
    }
  },
};

// Order Operations
export const shopifyOrderService = {
  async getAllOrders() {
    try {
      const response = await shopifyClient.getOrders();
      return response.orders;
    } catch (error) {
      throw new ShopifyServiceError(
        "Failed to fetch orders",
        "FETCH_ORDERS_ERROR",
        error
      );
    }
  },

  async getOrderById(orderId: string) {
    try {
      const response = await shopifyClient.getOrder(orderId);
      return response.order;
    } catch (error) {
      throw new ShopifyServiceError(
        `Failed to fetch order ${orderId}`,
        "FETCH_ORDER_ERROR",
        error
      );
    }
  },

  async getOrdersByStatus(status: string) {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(o => o.financial_status === status || o.fulfillment_status === status);
    } catch (error) {
      throw new ShopifyServiceError(
        `Failed to fetch orders by status ${status}`,
        "FETCH_ORDERS_BY_STATUS_ERROR",
        error
      );
    }
  },

  async getOrdersByCustomer(email: string) {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(o => o.email === email);
    } catch (error) {
      throw new ShopifyServiceError(
        `Failed to fetch orders for customer ${email}`,
        "FETCH_ORDERS_BY_CUSTOMER_ERROR",
        error
      );
    }
  },

  async getOrderStats() {
    try {
      const orders = await this.getAllOrders();
      return {
        total: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0),
        byStatus: {
          paid: orders.filter(o => o.financial_status === "paid").length,
          pending: orders.filter(o => o.financial_status === "pending").length,
          fulfilled: orders.filter(o => o.fulfillment_status === "fulfilled").length,
          unfulfilled: orders.filter(o => !o.fulfillment_status || o.fulfillment_status === "unfulfilled").length,
        },
      };
    } catch (error) {
      throw new ShopifyServiceError(
        "Failed to calculate order statistics",
        "ORDER_STATS_ERROR",
        error
      );
    }
  },
};

// Inventory Operations
export const shopifyInventoryService = {
  async getInventoryLevels() {
    try {
      const products = await shopifyProductService.getAllProducts();
      return products.map(product => ({
        productId: product.id,
        title: product.title,
        variants: product.variants.map(variant => ({
          variantId: variant.id,
          sku: variant.sku,
          inventory: variant.inventory_quantity,
          price: variant.price,
        })),
        totalInventory: product.variants.reduce((sum, v) => sum + v.inventory_quantity, 0),
      }));
    } catch (error) {
      throw new ShopifyServiceError(
        "Failed to fetch inventory levels",
        "FETCH_INVENTORY_ERROR",
        error
      );
    }
  },

  async getLowStockProducts(threshold: number = 10) {
    try {
      const products = await shopifyProductService.getAllProducts();
      return products.filter(product => 
        product.variants.some(v => v.inventory_quantity < threshold)
      );
    } catch (error) {
      throw new ShopifyServiceError(
        "Failed to fetch low stock products",
        "FETCH_LOW_STOCK_ERROR",
        error
      );
    }
  },

  async getOutOfStockProducts() {
    try {
      const products = await shopifyProductService.getAllProducts();
      return products.filter(product => 
        product.variants.every(v => v.inventory_quantity === 0)
      );
    } catch (error) {
      throw new ShopifyServiceError(
        "Failed to fetch out of stock products",
        "FETCH_OUT_OF_STOCK_ERROR",
        error
      );
    }
  },
};

// Shop Operations
export const shopifyShopService = {
  async getShopInfo() {
    try {
      const response = await shopifyClient.getShopInfo();
      return response.shop;
    } catch (error) {
      throw new ShopifyServiceError(
        "Failed to fetch shop information",
        "FETCH_SHOP_INFO_ERROR",
        error
      );
    }
  },

  async isConnected() {
    try {
      await shopifyClient.getShopInfo();
      return true;
    } catch {
      return false;
    }
  },
};

// Combined service export
export const shopifyService = {
  products: shopifyProductService,
  orders: shopifyOrderService,
  inventory: shopifyInventoryService,
  shop: shopifyShopService,
};
