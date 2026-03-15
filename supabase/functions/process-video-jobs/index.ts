import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Collects store assets (logo, products) for video generation.
 */
async function collectStoreAssets(supabase: ReturnType<typeof createClient>, storeId: string) {
  const [storeResult, productsResult] = await Promise.all([
    supabase
      .from('store_settings')
      .select('store_name, logo_url, niche')
      .eq('id', storeId)
      .single(),
    supabase
      .from('ai_generated_products')
      .select('name, description, image_url')
      .eq('store_id', storeId)
      .limit(6),
  ]);

  if (storeResult.error || !storeResult.data) {
    throw new Error(`Store not found: ${storeId}`);
  }

  return {
    store: storeResult.data,
    products: productsResult.data || [],
  };
}

/**
 * Builds the video generation payload from store assets.
 * This payload structure is the contract for any future video API integration.
 */
function buildVideoPayload(store: { store_name: string; logo_url: string | null; niche: string }, products: { name: string; description: string | null; image_url: string | null }[]) {
  return {
    storeName: store.store_name,
    logoUrl: store.logo_url,
    niche: store.niche,
    products: products.map((p) => ({
      title: p.name,
      description: p.description,
      imageUrl: p.image_url,
    })),
    marketingText: `Découvrez ${store.store_name} – Les meilleurs produits au meilleur prix!`,
    callToAction: 'Achetez maintenant!',
    durationTarget: 10, // seconds (5-15 range)
  };
}

/**
 * Simulates video generation. Replace this function with a real API call later.
 * The interface is stable: input payload → output { videoUrl, thumbnailUrl }.
 */
async function generateVideo(_payload: ReturnType<typeof buildVideoPayload>): Promise<{ videoUrl: string; thumbnailUrl: string }> {
  // TODO: Replace with actual video generation API call
  // Example: const result = await fetch('https://video-api.example.com/generate', { ... });
  return {
    videoUrl: 'https://storage.sokoby.com/sample-video.mp4',
    thumbnailUrl: 'https://storage.sokoby.com/sample-thumbnail.jpg',
  };
}

/**
 * Processes a single video generation job.
 */
async function processJob(supabase: ReturnType<typeof createClient>, job: { id: string; payload: { store_id?: string } | null }) {
  const jobId = job.id;
  const storeId = job.payload?.store_id;

  console.log(`[PROCESS-VIDEO-JOBS] Processing job ${jobId}, store_id=${storeId}`);

  // 1. Mark as processing
  await supabase
    .from('background_jobs')
    .update({ status: 'processing', updated_at: new Date().toISOString() })
    .eq('id', jobId);

  if (!storeId) throw new Error('Missing store_id in job payload');

  // 2. Collect store assets
  const { store, products } = await collectStoreAssets(supabase, storeId);
  console.log(`[PROCESS-VIDEO-JOBS] Store: ${store.store_name}, ${products.length} products`);

  // 3. Build payload
  const videoPayload = buildVideoPayload(store, products);
  console.log('[PROCESS-VIDEO-JOBS] Video payload prepared:', JSON.stringify(videoPayload).slice(0, 300));

  // 4. Generate video (currently simulated)
  const { videoUrl, thumbnailUrl } = await generateVideo(videoPayload);

  // 5. Update store_videos row
  const { error: videoUpdateError } = await supabase
    .from('store_videos')
    .update({
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      status: 'ready',
      updated_at: new Date().toISOString(),
    })
    .eq('store_id', storeId)
    .eq('status', 'pending');

  if (videoUpdateError) {
    console.error('[PROCESS-VIDEO-JOBS] Failed to update store_videos:', videoUpdateError.message);
  }

  // 6. Mark job as completed
  await supabase
    .from('background_jobs')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', jobId);

  console.log(`[PROCESS-VIDEO-JOBS] ✓ Job ${jobId} completed.`);
  return storeId;
}

/**
 * Background worker: processes pending "generate_store_video" jobs.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  console.log('[PROCESS-VIDEO-JOBS] Starting job scan...');

  // Fetch pending jobs
  const { data: jobs, error: fetchError } = await supabase
    .from('background_jobs')
    .select('*')
    .eq('job_type', 'generate_store_video')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(5);

  if (fetchError) {
    console.error('[PROCESS-VIDEO-JOBS] Failed to fetch jobs:', fetchError.message);
    return new Response(JSON.stringify({ error: fetchError.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  if (!jobs || jobs.length === 0) {
    console.log('[PROCESS-VIDEO-JOBS] No pending jobs found.');
    return new Response(JSON.stringify({ processed: 0, failed: 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  console.log(`[PROCESS-VIDEO-JOBS] Found ${jobs.length} pending job(s).`);

  let processed = 0;
  let failed = 0;

  for (const job of jobs) {
    const storeId = (job.payload as { store_id?: string } | null)?.store_id;
    try {
      await processJob(supabase, { id: job.id, payload: job.payload as { store_id?: string } | null });
      processed++;
    } catch (err) {
      console.error(`[PROCESS-VIDEO-JOBS] ✗ Job ${job.id} failed:`, err.message);

      await supabase
        .from('background_jobs')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', job.id);

      if (storeId) {
        await supabase
          .from('store_videos')
          .update({ status: 'failed', updated_at: new Date().toISOString() })
          .eq('store_id', storeId)
          .eq('status', 'pending');
      }

      failed++;
    }
  }

  console.log(`[PROCESS-VIDEO-JOBS] Done. Processed: ${processed}, Failed: ${failed}`);

  return new Response(
    JSON.stringify({ processed, failed }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
