import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Section {
  id: string;
  section_type: string;
  display_order: number;
  config: Record<string, any>;
  is_visible: boolean;
}

interface StorefrontData {
  theme: Record<string, any> | null;
  sections: Section[];
  isLoading: boolean;
}

export function useStorefrontEngine(storeId: string | null | undefined): StorefrontData {
  const [theme, setTheme] = useState<Record<string, any> | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storeId) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        // 1. Ensure theme assignment exists
        let themeData = await ensureThemeAssignment(storeId);
        setTheme(themeData);

        // 2. Ensure home page + sections exist
        const pageId = await ensureHomePage(storeId);

        // 3. Ensure default sections exist
        await ensureDefaultSections(pageId);

        // 4. Fetch final sections
        const { data: sectionRows } = await supabase
          .from("sections")
          .select("*")
          .eq("page_id", pageId)
          .order("display_order", { ascending: true });

        setSections(
          (sectionRows || []).map((s: any) => ({
            id: s.id,
            section_type: s.section_type,
            display_order: s.display_order,
            config: (s.config as Record<string, any>) || {},
            is_visible: s.is_visible ?? true,
          }))
        );
      } catch (err) {
        console.error("Storefront engine error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [storeId]);

  return { theme, sections, isLoading };
}

async function ensureThemeAssignment(storeId: string) {
  // Check existing assignment
  const { data: assignment } = await supabase
    .from("store_theme_assignments")
    .select("*, store_themes(*)")
    .eq("store_id", storeId)
    .eq("is_active", true)
    .maybeSingle();

  if (assignment) {
    return (assignment as any).store_themes || null;
  }

  // No assignment – ensure a default theme exists
  let { data: defaultTheme } = await supabase
    .from("store_themes")
    .select("*")
    .eq("is_default", true)
    .maybeSingle();

  if (!defaultTheme) {
    const { data: created } = await supabase
      .from("store_themes")
      .insert({
        name: "Thème par défaut",
        description: "Thème standard pour les nouvelles boutiques",
        is_default: true,
        layout_config: { max_width: "1280px" },
        color_palette: {},
        typography: {},
      })
      .select()
      .single();
    defaultTheme = created;
  }

  if (defaultTheme) {
    await supabase.from("store_theme_assignments").insert({
      store_id: storeId,
      theme_id: defaultTheme.id,
      is_active: true,
    });
  }

  return defaultTheme || null;
}

async function ensureHomePage(storeId: string): Promise<string> {
  const { data: page } = await supabase
    .from("pages")
    .select("id")
    .eq("store_id", storeId)
    .eq("slug", "home")
    .maybeSingle();

  if (page) return page.id;

  const { data: created } = await supabase
    .from("pages")
    .insert({
      store_id: storeId,
      slug: "home",
      title: "Home",
      is_published: true,
    })
    .select("id")
    .single();

  return created!.id;
}

async function ensureDefaultSections(pageId: string) {
  const { data: existing } = await supabase
    .from("sections")
    .select("id")
    .eq("page_id", pageId)
    .limit(1);

  if (existing && existing.length > 0) return;

  await supabase.from("sections").insert([
    {
      page_id: pageId,
      section_type: "hero",
      display_order: 0,
      config: {},
      is_visible: true,
    },
    {
      page_id: pageId,
      section_type: "featured_products",
      display_order: 1,
      config: {},
      is_visible: true,
    },
  ]);
}
