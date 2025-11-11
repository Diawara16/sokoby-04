export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  vendor: string;
  product_type: string;
  handle: string;
  status: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  options: ShopifyOption[];
}

export interface ShopifyImage {
  id: string;
  product_id: string;
  src: string;
  alt?: string;
  position: number;
}

export interface ShopifyVariant {
  id: string;
  product_id: string;
  title: string;
  price: string;
  sku?: string;
  inventory_quantity: number;
  option1?: string;
  option2?: string;
  option3?: string;
}

export interface ShopifyOption {
  id: string;
  product_id: string;
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyOrder {
  id: string;
  order_number: number;
  email: string;
  total_price: string;
  financial_status: string;
  fulfillment_status: string;
  line_items: ShopifyLineItem[];
  created_at: string;
}

export interface ShopifyLineItem {
  id: string;
  product_id: string;
  variant_id: string;
  title: string;
  quantity: number;
  price: string;
}

class ShopifyApiClient {
  private shop: string;
  private accessToken: string;

  constructor(shop: string, accessToken: string) {
    this.shop = shop;
    this.accessToken = accessToken;
  }

  private getBaseUrl(): string {
    return `https://${this.shop}/admin/api/2024-01`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "X-Shopify-Access-Token": this.accessToken,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Shopify API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Products
  async getProducts(limit = 50): Promise<{ products: ShopifyProduct[] }> {
    return this.request(`/products.json?limit=${limit}`);
  }

  async getProduct(productId: string): Promise<{ product: ShopifyProduct }> {
    return this.request(`/products/${productId}.json`);
  }

  async createProduct(product: Partial<ShopifyProduct>): Promise<{ product: ShopifyProduct }> {
    return this.request("/products.json", {
      method: "POST",
      body: JSON.stringify({ product }),
    });
  }

  async updateProduct(productId: string, product: Partial<ShopifyProduct>): Promise<{ product: ShopifyProduct }> {
    return this.request(`/products/${productId}.json`, {
      method: "PUT",
      body: JSON.stringify({ product }),
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    return this.request(`/products/${productId}.json`, {
      method: "DELETE",
    });
  }

  // Orders
  async getOrders(limit = 50): Promise<{ orders: ShopifyOrder[] }> {
    return this.request(`/orders.json?limit=${limit}&status=any`);
  }

  async getOrder(orderId: string): Promise<{ order: ShopifyOrder }> {
    return this.request(`/orders/${orderId}.json`);
  }

  // Shop Info
  async getShopInfo(): Promise<any> {
    return this.request("/shop.json");
  }
}

export const createShopifyClient = (shop: string, accessToken: string) => {
  return new ShopifyApiClient(shop, accessToken);
};
