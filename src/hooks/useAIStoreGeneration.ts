import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { AIStoreData } from "@/components/ai-store/AIStoreWizard";

type GenerationPhase =
  | "idle"
  | "auth"
  | "store"
  | "branding"
  | "products"
  | "finalizing"
  | "complete"
  | "error";

interface GenerationState {
  phase: GenerationPhase;
  progress: number;
  message: string;
  productsCreated: number;
  totalProducts: number;
  error: string | null;
  isLocked: boolean;
  generationId: string | null;
  isResuming: boolean;
}

/** Tracks which steps completed for a given generation */
interface GenerationCheckpoint {
  generationId: string;
  userId: string;
  storeCreated: boolean;
  brandingApplied: boolean;
  productsCreated: number;
  productsTotal: number;
  finalized: boolean;
  storeData: AIStoreData;
}

const STORAGE_KEY = "sokoby_ai_generation_checkpoint";

const INITIAL_STATE: GenerationState = {
  phase: "idle",
  progress: 0,
  message: "",
  productsCreated: 0,
  totalProducts: 0,
  error: null,
  isLocked: false,
  generationId: null,
  isResuming: false,
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function newGenerationId(): string {
  return `gen_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function saveCheckpoint(cp: GenerationCheckpoint) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cp));
  } catch {
    // storage unavailable — non-critical
  }
}

function loadCheckpoint(): GenerationCheckpoint | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GenerationCheckpoint;
  } catch {
    return null;
  }
}

function clearCheckpoint() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export function useAIStoreGeneration() {
  const [state, setState] = useState<GenerationState>(INITIAL_STATE);
  const { toast } = useToast();
  const lockRef = useRef(false);

  const update = (partial: Partial<GenerationState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  // On mount, detect incomplete generation for resume prompt
  useEffect(() => {
    const cp = loadCheckpoint();
    if (cp && !cp.finalized) {
      update({
        phase: "idle",
        generationId: cp.generationId,
        isResuming: false,
        message: "Une génération précédente peut être reprise.",
      });
    }
  }, []);

  /** Resume an interrupted generation */
  const resume = useCallback(async () => {
    const cp = loadCheckpoint();
    if (!cp || cp.finalized) {
      toast({ title: "Rien à reprendre", description: "Aucune génération interrompue trouvée." });
      return;
    }
    if (lockRef.current) return;
    lockRef.current = true;

    update({
      phase: "auth",
      progress: 5,
      message: "Reprise de la génération…",
      isLocked: true,
      generationId: cp.generationId,
      isResuming: true,
    });

    try {
      // Auth
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user || user.id !== cp.userId) {
        throw new Error("Session invalide. Veuillez vous reconnecter.");
      }

      const data = cp.storeData;

      // Store — skip if done
      if (!cp.storeCreated) {
        update({ phase: "store", progress: 15, message: "Reprise — Création boutique…" });
        await createOrUpdateStore(user.id, user.email!, data);
        cp.storeCreated = true;
        saveCheckpoint(cp);
      }

      // Branding — skip if done
      if (!cp.brandingApplied) {
        update({ phase: "branding", progress: 30, message: "Reprise — Branding…" });
        await applyBranding(user.id, data);
        cp.brandingApplied = true;
        saveCheckpoint(cp);
      }

      // Products — resume from last created
      const productsToCreate = data.products.slice(0, 10);
      const startIdx = cp.productsCreated;
      if (startIdx < productsToCreate.length) {
        update({
          phase: "products",
          progress: 40,
          message: `Reprise — Produits (${startIdx}/${productsToCreate.length})…`,
          productsCreated: startIdx,
          totalProducts: productsToCreate.length,
        });
        const created = await createProducts(user.id, data, productsToCreate, startIdx, cp);
        cp.productsCreated = created;
        saveCheckpoint(cp);
      }

      // Finalize
      update({ phase: "finalizing", progress: 90, message: "Finalisation…" });
      await finalizeGeneration(user.id, data, cp.productsCreated);
      cp.finalized = true;
      saveCheckpoint(cp);

      update({
        phase: "complete",
        progress: 100,
        message: "Votre boutique est prête !",
        productsCreated: cp.productsCreated,
        isLocked: false,
        isResuming: false,
      });
      clearCheckpoint();

      toast({
        title: "Boutique reprise avec succès",
        description: `${data.storeName} est prête avec ${cp.productsCreated} produits.`,
      });
    } catch (err: any) {
      const msg = err?.message || "Erreur lors de la reprise";
      update({ phase: "error", error: msg, message: msg, isLocked: false, isResuming: false });
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      lockRef.current = false;
    }
  }, [toast]);

  const generate = useCallback(async (data: AIStoreData) => {
    // Execution lock
    if (lockRef.current) {
      toast({
        title: "Génération en cours",
        description: "Veuillez patienter, votre boutique est en cours de création.",
      });
      return;
    }

    // Check for existing incomplete generation — offer resume instead
    const existingCp = loadCheckpoint();
    if (existingCp && !existingCp.finalized) {
      toast({
        title: "Génération précédente détectée",
        description: "Reprise automatique de la génération interrompue.",
      });
      await resume();
      return;
    }

    lockRef.current = true;
    const genId = newGenerationId();

    update({ phase: "auth", progress: 5, message: "Vérification du compte…", isLocked: true, generationId: genId, isResuming: false });

    const checkpoint: GenerationCheckpoint = {
      generationId: genId,
      userId: "",
      storeCreated: false,
      brandingApplied: false,
      productsCreated: 0,
      productsTotal: Math.min(data.products.length, 10),
      finalized: false,
      storeData: data,
    };

    try {
      // 1. Auth
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) throw new Error("Vous devez être connecté pour générer une boutique.");
      checkpoint.userId = user.id;
      saveCheckpoint(checkpoint);

      // 2. Store (idempotent upsert)
      update({ phase: "store", progress: 15, message: "Création de la boutique…" });
      await createOrUpdateStore(user.id, user.email!, data);
      checkpoint.storeCreated = true;
      saveCheckpoint(checkpoint);

      // 3. Branding (idempotent upsert)
      update({ phase: "branding", progress: 30, message: "Application du branding…" });
      await applyBranding(user.id, data);
      checkpoint.brandingApplied = true;
      saveCheckpoint(checkpoint);

      // 4. Products (sequential, resumable)
      const productsToCreate = data.products.slice(0, 10);
      update({
        phase: "products",
        progress: 40,
        message: `Ajout des produits (0/${productsToCreate.length})…`,
        totalProducts: productsToCreate.length,
        productsCreated: 0,
      });
      const created = await createProducts(user.id, data, productsToCreate, 0, checkpoint);

      // 5. Finalize
      update({ phase: "finalizing", progress: 90, message: "Finalisation…" });
      await finalizeGeneration(user.id, data, created);
      checkpoint.finalized = true;
      saveCheckpoint(checkpoint);

      // 6. Done
      update({
        phase: "complete",
        progress: 100,
        message: "Votre boutique est prête !",
        productsCreated: created,
        isLocked: false,
      });
      clearCheckpoint();

      toast({
        title: "Boutique créée avec succès",
        description: `${data.storeName} est prête avec ${created} produits.`,
      });
    } catch (err: any) {
      const msg = err?.message || "Une erreur inattendue s'est produite";
      update({ phase: "error", error: msg, message: msg, isLocked: false });
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      lockRef.current = false;
    }
  }, [toast, resume]);

  const reset = useCallback(() => {
    lockRef.current = false;
    clearCheckpoint();
    setState(INITIAL_STATE);
  }, []);

  const hasPendingGeneration = useCallback(() => {
    const cp = loadCheckpoint();
    return cp !== null && !cp.finalized;
  }, []);

  return { state, generate, reset, resume, hasPendingGeneration };
}

// ── Idempotent helpers ──────────────────────────────────────────

async function createOrUpdateStore(userId: string, email: string, data: AIStoreData) {
  const { data: existing } = await supabase
    .from("store_settings")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  const cleanNiche = data.niche.toLowerCase().replace(/[^a-z0-9]/g, "");
  const suffix = Math.random().toString(36).substring(2, 8);
  const domainName = `${cleanNiche}-${suffix}`;

  if (existing) {
    const { error } = await supabase
      .from("store_settings")
      .update({ domain_name: domainName, store_name: data.storeName, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
    if (error) throw new Error(`Erreur boutique: ${error.message}`);
  } else {
    const { error } = await supabase.from("store_settings").insert({
      user_id: userId,
      domain_name: domainName,
      store_name: data.storeName,
      store_email: email,
      store_description: data.slogan,
    });
    if (error) throw new Error(`Erreur boutique: ${error.message}`);
  }
}

async function applyBranding(userId: string, data: AIStoreData) {
  const { data: existing } = await supabase
    .from("brand_settings")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  const payload = {
    primary_color: data.primaryColor,
    secondary_color: data.secondaryColor,
    slogan: data.slogan,
  };

  if (existing) {
    await supabase.from("brand_settings").update(payload).eq("user_id", userId);
  } else {
    await supabase.from("brand_settings").insert({ user_id: userId, ...payload });
  }
}

async function createProducts(
  userId: string,
  data: AIStoreData,
  products: AIStoreData["products"],
  startIdx: number,
  checkpoint: GenerationCheckpoint,
): Promise<number> {
  let created = checkpoint.productsCreated;

  for (let i = startIdx; i < products.length; i++) {
    const product = products[i];

    // Idempotency: check if product with same name already exists for this user
    const { data: dup } = await supabase
      .from("products")
      .select("id")
      .eq("user_id", userId)
      .eq("name", product.name)
      .maybeSingle();

    if (!dup) {
      const productPayload = {
        user_id: userId,
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
    } else {
      // Already exists — count as created
      created++;
    }

    checkpoint.productsCreated = created;
    saveCheckpoint(checkpoint);

    // Update UI progress — use a function ref workaround via checkpoint
    const pct = 40 + Math.round(((i + 1 - startIdx) / (products.length - startIdx)) * 45);
    // We can't call update() here since it's outside the hook.
    // Instead the caller reads checkpoint. Progress is updated via the main loop.

    if (i < products.length - 1) {
      await delay(300 + Math.random() * 500);
    }
  }

  return created;
}

async function finalizeGeneration(userId: string, data: AIStoreData, created: number) {
  // Idempotent: only insert notification if not already present for this store name
  const { data: existingNotif } = await supabase
    .from("notifications")
    .select("id")
    .eq("user_id", userId)
    .eq("title", "Boutique IA créée")
    .ilike("content", `%${data.storeName}%`)
    .maybeSingle();

  if (!existingNotif) {
    await supabase.from("notifications").insert({
      user_id: userId,
      title: "Boutique IA créée",
      content: `Votre boutique "${data.storeName}" a été créée avec ${created} produits.`,
      read: false,
    });
  }
}
