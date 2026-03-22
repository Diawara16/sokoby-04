import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CREATOMATE_API_URL = 'https://api.creatomate.com/v1/renders';

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

function validateProducts(products: { name: string; description: string | null; image_url: string | null }[]) {
  const withImages = products.filter((p) => p.image_url);
  if (withImages.length === 0) {
    throw new Error('NO_PRODUCT_IMAGES');
  }
  return withImages;
}

function buildCreatomatePayload(
  templateId: string,
  store: { store_name: string; logo_url: string | null; niche: string },
  products: { name: string; description: string | null; image_url: string | null }[]
) {
  const modifications: Record<string, string> = {
    logo: store.logo_url || '',
    cta: 'Achetez maintenant!',
    title: store.store_name,
  };

  products.forEach((p, i) => {
    if (p.image_url) modifications[`image_${i + 1}`] = p.image_url;
    if (p.name) modifications[`title_${i + 1}`] = p.name;
  });

  return {
    template_id: templateId,
    modifications,
  };
}

async function generateVideoWithCreatomate(
  apiKey: string,
  templateId: string,
  store: { store_name: string; logo_url: string | null; niche: string },
  products: { name: string; description: string | null; image_url: string | null }[]
): Promise<{ videoUrl: string; thumbnailUrl: string }> {
  const payload = buildCreatomatePayload(templateId, store, products);

  console.log('[PROCESS-VIDEO-JOBS] Calling Creatomate API...');

  const response = await fetch(CREATOMATE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Creatomate API error [${response.status}]: ${errorBody}`);
  }

  const renders = await response.json();
  const render = Array.isArray(renders) ? renders[0] : renders;

  if (!render) {
    throw new Error('Creatomate returned empty response');
  }

  if (render.status && render.status !== 'succeeded') {
    const finalRender = await pollRenderStatus(apiKey, render.id);
    return {
      videoUrl: finalRender.url,
      thumbnailUrl: finalRender.snapshot_url || finalRender.url,
    };
  }

  return {
    videoUrl: render.url,
    thumbnailUrl: render.snapshot_url || render.url,
  };
}

async function pollRenderStatus(apiKey: string, renderId: string, maxAttempts = 30): Promise<{ url: string; snapshot_url?: string }> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 5000));

    const res = await fetch(`${CREATOMATE_API_URL}/${renderId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(`Creatomate poll error [${res.status}]`);
    }

    const render = await res.json();
    console.log(`[PROCESS-VIDEO-JOBS] Poll attempt ${i + 1}: status=${render.status}`);

    if (render.status === 'succeeded') return render;
    if (render.status === 'failed') throw new Error(`Creatomate render failed: ${render.error_message || 'unknown'}`);
  }

  throw new Error('Creatomate render timed out');
}

async function uploadToStorage(
  supabase: ReturnType<typeof createClient>,
  sourceUrl: string,
  storeId: string,
  filename: string
): Promise<string> {
  console.log(`[PROCESS-VIDEO-JOBS] Downloading ${filename} from Creatomate...`);
  const res = await fetch(sourceUrl);
  if (!res.ok) {
    throw new Error(`Failed to download file: ${res.status}`);
  }

  const blob = await res.blob();
  const contentType = res.headers.get('content-type') || 'video/mp4';
  const filePath = `${storeId}/${filename}`;

  console.log(`[PROCESS-VIDEO-JOBS] Uploading ${filePath} to store-videos bucket (${blob.size} bytes)...`);

  const { error } = await supabase.storage
    .from('store-videos')
    .upload(filePath, blob, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('store-videos')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

async function processJob(
  supabase: ReturnType<typeof createClient>,
  job: { id: string; payload: { store_id?: string } | null },
  apiKey: string,
  templateId: string
) {
  const jobId = job.id;
  const storeId = job.payload?.store_id;

  console.log(`[PROCESS-VIDEO-JOBS] Processing job ${jobId}, store_id=${storeId}`);

  await supabase
    .from('background_jobs')
    .update({ status: 'processing', updated_at: new Date().toISOString() })
    .eq('id', jobId);

  if (!storeId) throw new Error('Missing store_id in job payload');

  const { store, products } = await collectStoreAssets(supabase, storeId);
  console.log(`[PROCESS-VIDEO-JOBS] Store: ${store.store_name}, ${products.length} products`);

  // Validate that we have at least one product with an image
  const validProducts = validateProducts(products);
  console.log(`[PROCESS-VIDEO-JOBS] ${validProducts.length} products with images`);

  // Generate video via Creatomate
  const { videoUrl: creatomateVideoUrl, thumbnailUrl: creatomateThumbnailUrl } =
    await generateVideoWithCreatomate(apiKey, templateId, store, validProducts);

  // Upload video and thumbnail to Supabase Storage
  const timestamp = Date.now();
  const [storedVideoUrl, storedThumbnailUrl] = await Promise.all([
    uploadToStorage(supabase, creatomateVideoUrl, storeId, `video_${timestamp}.mp4`),
    creatomateThumbnailUrl !== creatomateVideoUrl
      ? uploadToStorage(supabase, creatomateThumbnailUrl, storeId, `thumb_${timestamp}.jpg`)
      : Promise.resolve(creatomateVideoUrl),
  ]);

  console.log(`[PROCESS-VIDEO-JOBS] Stored video: ${storedVideoUrl}`);

  const { error: videoUpdateError } = await supabase
    .from('store_videos')
    .update({
      video_url: storedVideoUrl,
      thumbnail_url: storedThumbnailUrl,
      status: 'ready',
      updated_at: new Date().toISOString(),
    })
    .eq('store_id', storeId)
    .eq('status', 'pending');

  if (videoUpdateError) {
    console.error('[PROCESS-VIDEO-JOBS] Failed to update store_videos:', videoUpdateError.message);
  }

  await supabase
    .from('background_jobs')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', jobId);

  console.log(`[PROCESS-VIDEO-JOBS] ✓ Job ${jobId} completed.`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const creatomateApiKey = Deno.env.get('CREATOMATE_API_KEY');
  if (!creatomateApiKey) {
    console.error('[PROCESS-VIDEO-JOBS] CREATOMATE_API_KEY not configured');
    return new Response(JSON.stringify({ error: 'CREATOMATE_API_KEY not configured' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  let templateId = Deno.env.get('CREATOMATE_TEMPLATE_ID') || '';
  try {
    const body = await req.json().catch(() => ({}));
    if (body.template_id) templateId = body.template_id;
  } catch (_) { /* no body */ }

  if (!templateId) {
    console.error('[PROCESS-VIDEO-JOBS] No template_id provided');
    return new Response(JSON.stringify({ error: 'No Creatomate template_id configured' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  console.log('[PROCESS-VIDEO-JOBS] Starting job scan...');

  const { data: jobs, error: fetchError } = await supabase
    .from('background_jobs')
    .select('*')
    .eq('job_type', 'generate_store_video')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(5);

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  if (!jobs || jobs.length === 0) {
    return new Response(JSON.stringify({ processed: 0, failed: 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let processed = 0;
  let failed = 0;

  for (const job of jobs) {
    const storeId = (job.payload as { store_id?: string } | null)?.store_id;
    try {
      await processJob(supabase, { id: job.id, payload: job.payload as { store_id?: string } | null }, creatomateApiKey, templateId);
      processed++;
    } catch (err) {
      const errorMsg = err.message || 'unknown error';
      console.error(`[PROCESS-VIDEO-JOBS] ✗ Job ${job.id} failed:`, errorMsg);
      await supabase.from('background_jobs').update({ status: 'failed', updated_at: new Date().toISOString() }).eq('id', job.id);
      if (storeId) {
        await supabase.from('store_videos').update({ status: 'failed', updated_at: new Date().toISOString() }).eq('store_id', storeId).eq('status', 'pending');
      }
      failed++;
    }
  }

  return new Response(
    JSON.stringify({ processed, failed }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
