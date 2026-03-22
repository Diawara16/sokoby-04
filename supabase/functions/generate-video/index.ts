import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Delegate to process-video-jobs which contains the full workflow
  const targetUrl = `${supabaseUrl}/functions/v1/process-video-jobs`;

  let body = '{}';
  try {
    const reqBody = await req.json().catch(() => ({}));
    body = JSON.stringify(reqBody);
  } catch (_) { /* empty */ }

  console.log('[GENERATE-VIDEO] Delegating to process-video-jobs...');

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
    },
    body,
  });

  const result = await response.text();
  console.log(`[GENERATE-VIDEO] Result: ${result}`);

  return new Response(result, {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
