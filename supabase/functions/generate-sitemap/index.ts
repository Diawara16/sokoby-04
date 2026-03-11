import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const domain = url.searchParams.get("domain");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find the store by domain
    let storeId: string | null = null;
    let storeDomain: string = domain || "";

    if (domain) {
      // Check domains table
      const { data: domainData } = await supabase
        .from("domains")
        .select("store_id")
        .eq("domain_name", domain)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      if (domainData?.store_id) {
        storeId = domainData.store_id;
      } else {
        // Check store_settings
        const { data: storeData } = await supabase
          .from("store_settings")
          .select("id")
          .eq("domain_name", domain)
          .limit(1)
          .maybeSingle();

        if (storeData) {
          storeId = storeData.id;
        }
      }
    }

    const baseUrl = domain ? `https://${domain}` : "https://sokoby.com";
    const today = new Date().toISOString().split("T")[0];

    let urls = [
      { loc: `${baseUrl}/`, lastmod: today, changefreq: "daily", priority: "1.0" },
    ];

    // Fetch published products for this store
    if (storeId) {
      const { data: products } = await supabase
        .from("products")
        .select("slug, created_at")
        .eq("store_id", storeId)
        .eq("published", true)
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

      if (products) {
        for (const product of products) {
          if (product.slug) {
            urls.push({
              loc: `${baseUrl}/products/${product.slug}`,
              lastmod: product.created_at?.split("T")[0] || today,
              changefreq: "weekly",
              priority: "0.8",
            });
          }
        }
      }

      // Fetch store pages
      const { data: pages } = await supabase
        .from("store_pages")
        .select("slug, created_at")
        .eq("store_id", storeId)
        .eq("is_published", true);

      if (pages) {
        for (const page of pages) {
          if (page.slug && page.slug !== "home") {
            urls.push({
              loc: `${baseUrl}/${page.slug}`,
              lastmod: page.created_at?.split("T")[0] || today,
              changefreq: "monthly",
              priority: "0.6",
            });
          }
        }
      }
    } else {
      // Platform sitemap (no specific store)
      urls.push(
        { loc: `${baseUrl}/a-propos`, lastmod: today, changefreq: "monthly", priority: "0.7" },
        { loc: `${baseUrl}/contact`, lastmod: today, changefreq: "monthly", priority: "0.7" },
        { loc: `${baseUrl}/tarifs`, lastmod: today, changefreq: "monthly", priority: "0.8" },
        { loc: `${baseUrl}/fonctionnalites`, lastmod: today, changefreq: "monthly", priority: "0.8" },
        { loc: `${baseUrl}/blog`, lastmod: today, changefreq: "daily", priority: "0.7" },
      );
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sokoby.com/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`,
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/xml",
        },
      }
    );
  }
});
