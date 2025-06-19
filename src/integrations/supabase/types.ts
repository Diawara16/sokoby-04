export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_generated_products: {
        Row: {
          created_at: string
          description: string | null
          estimated_delivery_date: string | null
          id: string
          image_url: string | null
          name: string
          niche: string
          price: number
          shipping_carrier: string | null
          status: string | null
          store_id: string
          supplier: string
          tracking_number: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_delivery_date?: string | null
          id?: string
          image_url?: string | null
          name: string
          niche: string
          price: number
          shipping_carrier?: string | null
          status?: string | null
          store_id: string
          supplier: string
          tracking_number?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_delivery_date?: string | null
          id?: string
          image_url?: string | null
          name?: string
          niche?: string
          price?: number
          shipping_carrier?: string | null
          status?: string | null
          store_id?: string
          supplier?: string
          tracking_number?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_generated_products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      app_connections: {
        Row: {
          app_name: string
          connected_at: string | null
          ebay_settings: Json | null
          id: string
          pinterest_settings: Json | null
          settings: Json | null
          status: string
          user_id: string
          walmart_settings: Json | null
        }
        Insert: {
          app_name: string
          connected_at?: string | null
          ebay_settings?: Json | null
          id?: string
          pinterest_settings?: Json | null
          settings?: Json | null
          status?: string
          user_id: string
          walmart_settings?: Json | null
        }
        Update: {
          app_name?: string
          connected_at?: string | null
          ebay_settings?: Json | null
          id?: string
          pinterest_settings?: Json | null
          settings?: Json | null
          status?: string
          user_id?: string
          walmart_settings?: Json | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_settings: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          slogan: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          slogan?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          slogan?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          admin_id: string | null
          content: string
          created_at: string
          id: string
          is_admin: boolean | null
          read: boolean | null
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_admin?: boolean | null
          read?: boolean | null
          user_id: string
        }
        Update: {
          admin_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_admin?: boolean | null
          read?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      cookie_consents: {
        Row: {
          consent_date: string | null
          consent_given: boolean | null
          created_at: string | null
          id: string
          preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          consent_date?: string | null
          consent_given?: boolean | null
          created_at?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          consent_date?: string | null
          consent_given?: boolean | null
          created_at?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          discount_percent: number
          id: string
          max_uses: number | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          discount_percent: number
          id?: string
          max_uses?: number | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          discount_percent?: number
          id?: string
          max_uses?: number | null
          valid_until?: string | null
        }
        Relationships: []
      }
      customer_details: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          customer_type: string | null
          full_name: string | null
          id: string
          last_purchase_date: string | null
          notes: string | null
          phone_number: string | null
          postal_code: string | null
          total_orders: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          customer_type?: string | null
          full_name?: string | null
          id?: string
          last_purchase_date?: string | null
          notes?: string | null
          phone_number?: string | null
          postal_code?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          customer_type?: string | null
          full_name?: string | null
          id?: string
          last_purchase_date?: string | null
          notes?: string | null
          phone_number?: string | null
          postal_code?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      customer_notes: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string
          customer_id: string
          id: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          created_by: string
          customer_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string
          customer_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_details"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_tag_relations: {
        Row: {
          created_at: string
          customer_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_tag_relations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "customer_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      delivery_routes: {
        Row: {
          created_at: string
          estimated_delivery_time: unknown | null
          id: string
          optimization_score: number | null
          route_data: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_delivery_time?: unknown | null
          id?: string
          optimization_score?: number | null
          route_data: Json
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_delivery_time?: unknown | null
          id?: string
          optimization_score?: number | null
          route_data?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dns_monitoring: {
        Row: {
          created_at: string
          dns_records: Json | null
          domain_name: string
          id: string
          issues: string[] | null
          last_check_time: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dns_records?: Json | null
          domain_name: string
          id?: string
          issues?: string[] | null
          last_check_time?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dns_records?: Json | null
          domain_name?: string
          id?: string
          issues?: string[] | null
          last_check_time?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      domain_verifications: {
        Row: {
          created_at: string
          domain_name: string
          id: string
          user_id: string
          verification_token: string
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          domain_name: string
          id?: string
          user_id: string
          verification_token: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          domain_name?: string
          id?: string
          user_id?: string
          verification_token?: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: []
      }
      email_campaign_stats: {
        Row: {
          campaign_id: string
          clicks: number | null
          created_at: string
          emails_sent: number | null
          id: string
          opens: number | null
          unsubscribes: number | null
          updated_at: string
        }
        Insert: {
          campaign_id: string
          clicks?: number | null
          created_at?: string
          emails_sent?: number | null
          id?: string
          opens?: number | null
          unsubscribes?: number | null
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          clicks?: number | null
          created_at?: string
          emails_sent?: number | null
          id?: string
          opens?: number | null
          unsubscribes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaign_stats_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          name: string
          scheduled_for: string | null
          segment_filters: Json | null
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          name: string
          scheduled_for?: string | null
          segment_filters?: Json | null
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string
          scheduled_for?: string | null
          segment_filters?: Json | null
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      flash_sales: {
        Row: {
          created_at: string
          discount_percent: number
          end_time: string
          id: string
          original_price: number
          product_id: string
          sale_price: number
          start_time: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discount_percent: number
          end_time: string
          id?: string
          original_price: number
          product_id: string
          sale_price: number
          start_time: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discount_percent?: number
          end_time?: string
          id?: string
          original_price?: number
          product_id?: string
          sale_price?: number
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flash_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      interac_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string
          reference_number: string | null
          security_answer: string | null
          security_question: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id: string
          reference_number?: string | null
          security_answer?: string | null
          security_question?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          reference_number?: string | null
          security_answer?: string | null
          security_question?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interac_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      interac_settings: {
        Row: {
          created_at: string
          email: string
          enabled: boolean | null
          id: string
          merchant_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          enabled?: boolean | null
          id?: string
          merchant_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          enabled?: boolean | null
          id?: string
          merchant_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string
          current_tier: string
          id: string
          lifetime_points: number
          points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_tier?: string
          id?: string
          lifetime_points?: number
          points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_tier?: string
          id?: string
          lifetime_points?: number
          points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_points_history: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          points_change: number
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          points_change: number
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          points_change?: number
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_rewards: {
        Row: {
          created_at: string
          description: string
          discount_value: number | null
          id: string
          is_active: boolean | null
          minimum_tier: string
          name: string
          points_cost: number
          reward_type: string
        }
        Insert: {
          created_at?: string
          description: string
          discount_value?: number | null
          id?: string
          is_active?: boolean | null
          minimum_tier?: string
          name: string
          points_cost: number
          reward_type: string
        }
        Update: {
          created_at?: string
          description?: string
          discount_value?: number | null
          id?: string
          is_active?: boolean | null
          minimum_tier?: string
          name?: string
          points_cost?: number
          reward_type?: string
        }
        Relationships: []
      }
      marketplace_configurations: {
        Row: {
          api_credentials: Json | null
          created_at: string
          id: string
          marketplace_name: string
          settings: Json | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_credentials?: Json | null
          created_at?: string
          id?: string
          marketplace_name: string
          settings?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_credentials?: Json | null
          created_at?: string
          id?: string
          marketplace_name?: string
          settings?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      marketplace_details: {
        Row: {
          api_endpoint: string | null
          code: string
          created_at: string
          description: string | null
          documentation_url: string | null
          id: string
          name: string
          region_id: string | null
          requirements: string[] | null
          status: string | null
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          code: string
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          id?: string
          name: string
          region_id?: string | null
          requirements?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          code?: string
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          id?: string
          name?: string
          region_id?: string | null
          requirements?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_details_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "marketplace_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_integrations: {
        Row: {
          created_at: string
          credentials: Json | null
          id: string
          last_sync_at: string | null
          marketplace_name: string
          settings: Json | null
          status: string
          store_id: string | null
          sync_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials?: Json | null
          id?: string
          last_sync_at?: string | null
          marketplace_name: string
          settings?: Json | null
          status?: string
          store_id?: string | null
          sync_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: Json | null
          id?: string
          last_sync_at?: string | null
          marketplace_name?: string
          settings?: Json | null
          status?: string
          store_id?: string | null
          sync_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      marketplace_products: {
        Row: {
          configuration_id: string
          created_at: string
          id: string
          last_sync_at: string | null
          marketplace_product_id: string | null
          product_id: string
          sync_error: string | null
          sync_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          configuration_id: string
          created_at?: string
          id?: string
          last_sync_at?: string | null
          marketplace_product_id?: string | null
          product_id: string
          sync_error?: string | null
          sync_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          configuration_id?: string
          created_at?: string
          id?: string
          last_sync_at?: string | null
          marketplace_product_id?: string | null
          product_id?: string
          sync_error?: string | null
          sync_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_products_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "marketplace_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_regions: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      marketplace_webhooks: {
        Row: {
          created_at: string
          id: string
          last_triggered_at: string | null
          marketplace_name: string
          status: string
          updated_at: string
          user_id: string
          webhook_secret: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_triggered_at?: string | null
          marketplace_name: string
          status?: string
          updated_at?: string
          user_id: string
          webhook_secret?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string
          id?: string
          last_triggered_at?: string | null
          marketplace_name?: string
          status?: string
          updated_at?: string
          user_id?: string
          webhook_secret?: string | null
          webhook_url?: string
        }
        Relationships: []
      }
      migration_data: {
        Row: {
          created_at: string
          data_type: string
          id: string
          mapped_data: Json | null
          migrated_id: string | null
          migration_request_id: string
          source_data: Json
          source_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_type: string
          id?: string
          mapped_data?: Json | null
          migrated_id?: string | null
          migration_request_id: string
          source_data: Json
          source_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_type?: string
          id?: string
          mapped_data?: Json | null
          migrated_id?: string | null
          migration_request_id?: string
          source_data?: Json
          source_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_data_migration_request_id_fkey"
            columns: ["migration_request_id"]
            isOneToOne: false
            referencedRelation: "migration_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_requests: {
        Row: {
          contact_email: string
          contact_phone: string | null
          created_at: string
          estimated_completion_date: string | null
          id: string
          migration_type: Json | null
          notes: string | null
          priority: string
          shopify_access_token: string | null
          shopify_store_url: string | null
          source_platform: string
          status: string
          store_size: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          estimated_completion_date?: string | null
          id?: string
          migration_type?: Json | null
          notes?: string | null
          priority?: string
          shopify_access_token?: string | null
          shopify_store_url?: string | null
          source_platform?: string
          status?: string
          store_size?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          estimated_completion_date?: string | null
          id?: string
          migration_type?: Json | null
          notes?: string | null
          priority?: string
          shopify_access_token?: string | null
          shopify_store_url?: string | null
          source_platform?: string
          status?: string
          store_size?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      migration_steps: {
        Row: {
          completed_at: string | null
          created_at: string
          data_migrated: Json | null
          error_message: string | null
          id: string
          migration_request_id: string
          notes: string | null
          started_at: string | null
          status: string
          step_name: string
          step_order: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          data_migrated?: Json | null
          error_message?: string | null
          id?: string
          migration_request_id: string
          notes?: string | null
          started_at?: string | null
          status?: string
          step_name: string
          step_order: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          data_migrated?: Json | null
          error_message?: string | null
          id?: string
          migration_request_id?: string
          notes?: string | null
          started_at?: string | null
          status?: string
          step_name?: string
          step_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_steps_migration_request_id_fkey"
            columns: ["migration_request_id"]
            isOneToOne: false
            referencedRelation: "migration_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_at_time: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_at_time: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_at_time?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          estimated_delivery_date: string | null
          id: string
          payment_intent_id: string | null
          shipping_address: Json | null
          shipping_carrier: string | null
          status: string
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          estimated_delivery_date?: string | null
          id?: string
          payment_intent_id?: string | null
          shipping_address?: Json | null
          shipping_carrier?: string | null
          status?: string
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          estimated_delivery_date?: string | null
          id?: string
          payment_intent_id?: string | null
          shipping_address?: Json | null
          shipping_carrier?: string | null
          status?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          payment_method: string | null
          status: string
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          status: string
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_integrations: {
        Row: {
          created_at: string
          id: string
          provider: string
          settings: Json | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          provider: string
          settings?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          provider?: string
          settings?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pre_orders: {
        Row: {
          created_at: string
          estimated_arrival: string | null
          id: string
          product_id: string
          quantity: number
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_arrival?: string | null
          id?: string
          product_id: string
          quantity?: number
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_arrival?: string | null
          id?: string
          product_id?: string
          quantity?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pre_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_recommendations: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          products: Json
          reason: string | null
          score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          products: Json
          reason?: string | null
          score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          products?: Json
          reason?: string | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_recommendations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_details"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          content: string
          created_at: string
          id: string
          product_id: string
          rating: number
          title: string
          updated_at: string
          user_id: string
          verified_purchase: boolean | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          product_id: string
          rating: number
          title: string
          updated_at?: string
          user_id: string
          verified_purchase?: boolean | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          title?: string
          updated_at?: string
          user_id?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          id: string
          image: string | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string | null
          name: string
          price: number
        }
        Update: {
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_verified: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          features_usage: Json | null
          id: string
          last_login: string | null
          phone: string | null
          social_links: Json | null
          trial_ends_at: string | null
          website: string | null
        }
        Insert: {
          age_verified?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          features_usage?: Json | null
          id: string
          last_login?: string | null
          phone?: string | null
          social_links?: Json | null
          trial_ends_at?: string | null
          website?: string | null
        }
        Update: {
          age_verified?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          features_usage?: Json | null
          id?: string
          last_login?: string | null
          phone?: string | null
          social_links?: Json | null
          trial_ends_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          code: string
          converted_at: string | null
          created_at: string
          id: string
          referred_id: string | null
          referrer_id: string
          reward_claimed: boolean | null
          status: string
        }
        Insert: {
          code: string
          converted_at?: string | null
          created_at?: string
          id?: string
          referred_id?: string | null
          referrer_id: string
          reward_claimed?: boolean | null
          status?: string
        }
        Update: {
          code?: string
          converted_at?: string | null
          created_at?: string
          id?: string
          referred_id?: string | null
          referrer_id?: string
          reward_claimed?: boolean | null
          status?: string
        }
        Relationships: []
      }
      returns: {
        Row: {
          automated_status: string | null
          created_at: string | null
          description: string | null
          id: string
          order_id: string | null
          processing_notes: string[] | null
          reason: string
          return_type: string | null
          shipping_label_url: string | null
          status: string | null
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          automated_status?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          processing_notes?: string[] | null
          reason: string
          return_type?: string | null
          shipping_label_url?: string | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          automated_status?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          processing_notes?: string[] | null
          reason?: string
          return_type?: string | null
          shipping_label_url?: string | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      review_photos: {
        Row: {
          created_at: string
          id: string
          photo_url: string
          review_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          photo_url: string
          review_id: string
        }
        Update: {
          created_at?: string
          id?: string
          photo_url?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_photos_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_integrations: {
        Row: {
          api_key: string | null
          created_at: string
          id: string
          provider: string
          settings: Json | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          id?: string
          provider: string
          settings?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          id?: string
          provider?: string
          settings?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shipping_partners: {
        Row: {
          api_key: string | null
          coverage_areas: string[] | null
          created_at: string
          id: string
          integration_type: string
          name: string
          pricing_rules: Json | null
          settings: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key?: string | null
          coverage_areas?: string[] | null
          created_at?: string
          id?: string
          integration_type: string
          name: string
          pricing_rules?: Json | null
          settings?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string | null
          coverage_areas?: string[] | null
          created_at?: string
          id?: string
          integration_type?: string
          name?: string
          pricing_rules?: Json | null
          settings?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_catalog_items: {
        Row: {
          created_at: string
          id: string
          integration_id: string
          last_sync_at: string | null
          platform_data: Json | null
          platform_product_id: string | null
          product_id: string
          sync_error: string | null
          sync_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          integration_id: string
          last_sync_at?: string | null
          platform_data?: Json | null
          platform_product_id?: string | null
          product_id: string
          sync_error?: string | null
          sync_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          integration_id?: string
          last_sync_at?: string | null
          platform_data?: Json | null
          platform_product_id?: string | null
          product_id?: string
          sync_error?: string | null
          sync_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_catalog_items_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "social_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_catalog_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      social_integrations: {
        Row: {
          created_at: string
          credentials: Json | null
          id: string
          platform: string
          settings: Json | null
          status: string | null
          tiktok_settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials?: Json | null
          id?: string
          platform: string
          settings?: Json | null
          status?: string | null
          tiktok_settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: Json | null
          id?: string
          platform?: string
          settings?: Json | null
          status?: string | null
          tiktok_settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          email: string
          id: string
          invited_at: string | null
          joined_at: string | null
          permissions: Json
          role: string
          status: string
          store_id: string
          user_id: string
        }
        Insert: {
          email: string
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          permissions?: Json
          role: string
          status?: string
          store_id: string
          user_id: string
        }
        Update: {
          email?: string
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          permissions?: Json
          role?: string
          status?: string
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_predictions: {
        Row: {
          confidence_score: number
          created_at: string
          factors: Json | null
          id: string
          predicted_demand: number
          prediction_period: unknown
          product_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score: number
          created_at?: string
          factors?: Json | null
          id?: string
          predicted_demand: number
          prediction_period: unknown
          product_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          factors?: Json | null
          id?: string
          predicted_demand?: number
          prediction_period?: unknown
          product_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_predictions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          created_at: string
          default_currency: string | null
          default_language: string | null
          display_settings: Json | null
          domain_name: string | null
          email_template_invoice: Json | null
          email_template_order: Json | null
          gdpr_settings: Json | null
          id: string
          invoice_footer_text: string | null
          invoice_legal_notice: string | null
          invoice_prefix: string | null
          invoice_template: Json | null
          is_custom_domain: boolean | null
          notification_settings: Json | null
          social_media: Json | null
          store_address: string | null
          store_email: string | null
          store_name: string
          store_phone: string | null
          timezone: string | null
          updated_at: string
          user_id: string
          vat_number: string | null
          vat_rate: number | null
        }
        Insert: {
          created_at?: string
          default_currency?: string | null
          default_language?: string | null
          display_settings?: Json | null
          domain_name?: string | null
          email_template_invoice?: Json | null
          email_template_order?: Json | null
          gdpr_settings?: Json | null
          id?: string
          invoice_footer_text?: string | null
          invoice_legal_notice?: string | null
          invoice_prefix?: string | null
          invoice_template?: Json | null
          is_custom_domain?: boolean | null
          notification_settings?: Json | null
          social_media?: Json | null
          store_address?: string | null
          store_email?: string | null
          store_name: string
          store_phone?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          vat_number?: string | null
          vat_rate?: number | null
        }
        Update: {
          created_at?: string
          default_currency?: string | null
          default_language?: string | null
          display_settings?: Json | null
          domain_name?: string | null
          email_template_invoice?: Json | null
          email_template_order?: Json | null
          gdpr_settings?: Json | null
          id?: string
          invoice_footer_text?: string | null
          invoice_legal_notice?: string | null
          invoice_prefix?: string | null
          invoice_template?: Json | null
          is_custom_domain?: boolean | null
          notification_settings?: Json | null
          social_media?: Json | null
          store_address?: string | null
          store_email?: string | null
          store_name?: string
          store_phone?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          vat_number?: string | null
          vat_rate?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          status: string
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          status: string
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sync_history: {
        Row: {
          completed_at: string | null
          error_details: Json | null
          id: string
          integration_id: string
          items_failed: number | null
          items_processed: number | null
          items_succeeded: number | null
          started_at: string
          status: string
          sync_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          error_details?: Json | null
          id?: string
          integration_id: string
          items_failed?: number | null
          items_processed?: number | null
          items_succeeded?: number | null
          started_at?: string
          status: string
          sync_type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          error_details?: Json | null
          id?: string
          integration_id?: string
          items_failed?: number | null
          items_processed?: number | null
          items_succeeded?: number | null
          started_at?: string
          status?: string
          sync_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_history_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "social_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_templates: {
        Row: {
          colors: Json
          components: Json
          created_at: string
          description: string | null
          id: string
          layout: Json
          name: string
          niche: string
          preview_url: string | null
          typography: Json
        }
        Insert: {
          colors?: Json
          components?: Json
          created_at?: string
          description?: string | null
          id?: string
          layout?: Json
          name: string
          niche: string
          preview_url?: string | null
          typography?: Json
        }
        Update: {
          colors?: Json
          components?: Json
          created_at?: string
          description?: string | null
          id?: string
          layout?: Json
          name?: string
          niche?: string
          preview_url?: string | null
          typography?: Json
        }
        Relationships: []
      }
      user_behaviors: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          page_url: string | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      virtual_try_ons: {
        Row: {
          created_at: string
          generated_image: string | null
          id: string
          product_id: string
          user_id: string
          user_image: string | null
        }
        Insert: {
          created_at?: string
          generated_image?: string | null
          id?: string
          product_id: string
          user_id: string
          user_image?: string | null
        }
        Update: {
          created_at?: string
          generated_image?: string | null
          id?: string
          product_id?: string
          user_id?: string
          user_image?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "virtual_try_ons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_dns_records: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_secret: {
        Args: { name: string }
        Returns: string
      }
      update_flash_sales_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      marketplace_platform:
        | "facebook"
        | "instagram"
        | "tiktok"
        | "amazon"
        | "ebay"
        | "walmart"
        | "pinterest"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      marketplace_platform: [
        "facebook",
        "instagram",
        "tiktok",
        "amazon",
        "ebay",
        "walmart",
        "pinterest",
      ],
    },
  },
} as const
