import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { AIStoreData } from "@/components/ai-store/AIStoreWizard";

type GenerationPhase =
  | "idle"
  | "auth"
  | "store"
  | "branding"
  | "products"
  | "complete"
  | "error";

interface GenerationState {
  phase: GenerationPhase;
  progress: number;
  message: string;
  productsCreated: number;
  totalProducts: number;
  error: string | null;
}

const INITIAL_STATE: GenerationState = {
  phase: "idle",
  progress: 0,
  message: "",
  productsCreated: 0,
  totalProducts: 0,
  error: null,
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useAIStoreGeneration() {
  const [state, setState] = useState<GenerationState>(INITIAL_STATE);
  const { toast } = useToast();

  const update = (partial: Partial<GenerationState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const generate = useCallback(async (data: AIStoreData) => {
    update({ phase: "auth", progress: 5, message: "Vérification du compte…" });

    try {
      // 1. Auth check
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) {
        throw new Error("Vous devez être connecté pour générer une boutique.");
      }

      // 2. Create / update store_settings (existing pipeline)
      update({ phase: "store", progress: 15, message: "Création de la boutique…" });

      const cleanNiche = data.niche.toLowerCase().replace(/[^a-z0-9]/g, "");
      const suffix = Math.random().toString(36).substring(2, 8);
      const domainName = `${cleanNiche}-${suffix}`;

      const { data: existing } = await supabase
        .from("store_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("store_settings")
          .update({
            domain_name: domainName,
            store_name: data.storeName,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
        if (error) throw new Error(`Erreur boutique: ${error.message}`);
      } else {
        const { error } = await supabase.from("store_settings").insert({
          user_id: user.id,
          domain_name: domainName,
          store_name: data.storeName,
          store_email: user.email,
          store_description: data.slogan,
        });
        if (error) throw new Error(`Erreur boutique: ${error.message}`);
      }

      // 3. Apply branding (existing brand_settings)
      update({ phase: "branding", progress: 30, message: "Application du branding…" });

      const { data: existingBrand } = await supabase
        .from("brand_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      const brandPayload = {
        primary_color: data.primaryColor,
        secondary_color: data.secondaryColor,
        slogan: data.slogan,
      };

      if (existingBrand) {
        await supabase
          .from("brand_settings")
          .update(brandPayload)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("brand_settings")
          .insert({ user_id: user.id, ...brandPayload });
      }

      // 4. Sequential product creation (max 10, with delay)
      const productsToCreate = data.products.slice(0, 10);
      update({
        phase: "products",
        progress: 40,
        message: `Ajout des produits (0/${productsToCreate.length})…`,
        totalProducts: productsToCreate.length,
        productsCreated: 0,
      });

      let created = 0;
      for (let i = 0; i < productsToCreate.length; i++) {
        const product = productsToCreate[i];
        const productPayload = {
          user_id: user.id,
          name: product.name,
          price: product.price,
          category: product.category,
          status: "active" as const,
          is_visible: true,
          published: true,
          description: `${product.name} — ${data.storeName}`,
          image: product.image || null,
        };

        let success = false;
        for (let attempt = 0; attempt < 2 && !success; attempt++) {
          const { error } = await supabase.from("products").insert(productPayload);
          if (!error) {
            success = true;
            created++;
          } else {
            console.warn(`Product insert attempt ${attempt + 1} failed:`, error.message);
            if (attempt === 0) await delay(500);
          }
        }

        const pct = 40 + Math.round(((i + 1) / productsToCreate.length) * 50);
        update({
          progress: pct,
          productsCreated: created,
          message: `Ajout des produits (${i + 1}/${productsToCreate.length})…`,
        });

        // 300-800ms delay between products
        if (i < productsToCreate.length - 1) {
          await delay(300 + Math.random() * 500);
        }
      }

      // 5. Create notification (existing system)
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Boutique IA créée",
        content: `Votre boutique "${data.storeName}" a été créée avec ${created} produits.`,
        read: false,
      }).then(() => {});

      // 6. Done
      update({
        phase: "complete",
        progress: 100,
        message: "Votre boutique est prête !",
        productsCreated: created,
      });

      toast({
        title: "Boutique créée avec succès",
        description: `${data.storeName} est prête avec ${created} produits.`,
      });
    } catch (err: any) {
      const msg = err?.message || "Une erreur inattendue s'est produite";
      update({ phase: "error", error: msg, message: msg });
      toast({
        title: "Erreur",
        description: msg,
        variant: "destructive",
      });
    }
  }, [toast]);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return { state, generate, reset };
}
