import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Background worker: processes pending "generate_store_video" jobs.
 * Currently uses a placeholder video URL; swap in a real video API later.
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

  // 1. Fetch pending jobs
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
    return new Response(JSON.stringify({ processed: 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  console.log(`[PROCESS-VIDEO-JOBS] Found ${jobs.length} pending job(s).`);

  let processed = 0;
  let failed = 0;

  for (const job of jobs) {
    const jobId = job.id;
    const payload = job.payload as { store_id?: string } | null;
    const storeId = payload?.store_id;

    console.log(`[PROCESS-VIDEO-JOBS] Processing job ${jobId}, store_id=${storeId}`);

    // 2. Mark as processing
    await supabase
      .from('background_jobs')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', jobId);

    try {
      if (!storeId) throw new Error('Missing store_id in job payload');

      // 3. Collect store assets
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

      const store = storeResult.data;
      const products = productsResult.data || [];

      if (!store) throw new Error(`Store not found: ${storeId}`);

      console.log(`[PROCESS-VIDEO-JOBS] Store: ${store.store_name}, ${products.length} products`);

      // 4. Prepare video generation payload (for future API integration)
      const videoPayload = {
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

      console.log('[PROCESS-VIDEO-JOBS] Video payload prepared:', JSON.stringify(videoPayload).slice(0, 300));

      // 5. Simulate video generation (placeholder – replace with real API later)
      // TODO: Replace this block with an actual video generation API call
      // e.g. const videoUrl = await generateVideoWithAPI(videoPayload);
      const placeholderVideoUrl = 'https://storage.sokoby.com/sample-video.mp4';

      // 6. Update store_videos row
      const { error: videoUpdateError } = await supabase
        .from('store_videos')
        .update({
          video_url: placeholderVideoUrl,
          status: 'ready',
          updated_at: new Date().toISOString(),
        })
        .eq('store_id', storeId)
        .eq('status', 'pending');

      if (videoUpdateError) {
        console.error('[PROCESS-VIDEO-JOBS] Failed to update store_videos:', videoUpdateError.message);
      }

      // 7. Mark job as completed
      await supabase
        .from('background_jobs')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', jobId);

      console.log(`[PROCESS-VIDEO-JOBS] ✓ Job ${jobId} completed.`);
      processed++;
    } catch (err) {
      console.error(`[PROCESS-VIDEO-JOBS] ✗ Job ${jobId} failed:`, err.message);

      await supabase
        .from('background_jobs')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', jobId);

      // Also mark the store_videos row as failed
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
