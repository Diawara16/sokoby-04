import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ message: "Method not allowed" }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Extract and validate authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { storeName } = await req.json();
    
    if (!storeName || storeName.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Store name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Manual store creation request:", { storeName, userId: user.id });

    // Ensure user profile exists with age_verified = true
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('age_verified')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      // Create profile if it doesn't exist
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          age_verified: true,
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date().toISOString()
        });

      if (createProfileError) {
        console.error("Error creating profile:", createProfileError);
        // Continue anyway - the profile might exist but query failed
      }
    } else if (!profile.age_verified) {
      // Update existing profile to set age_verified = true
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ age_verified: true })
        .eq('id', user.id);

      if (updateProfileError) {
        console.error("Error updating profile:", updateProfileError);
      }
    }

    // Check if user already has a store
    const { data: existingStore } = await supabase
      .from('store_settings')
      .select('id, store_name, store_type')
      .eq('user_id', user.id)
      .single();

    if (existingStore) {
      console.log("User already has a store:", existingStore);
      
      // Update existing store if it's pending
      if (existingStore.store_type === 'pending') {
        const trialStartDate = new Date();
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14);
        
        const domainName = `${storeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${user.id.substring(0, 8)}.sokoby.com`;
        
        const { error: updateError } = await supabase
          .from('store_settings')
          .update({
            store_name: storeName,
            store_type: 'manual',
            trial_start_date: trialStartDate.toISOString(),
            trial_end_date: trialEndDate.toISOString(),
            domain_name: domainName,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error("Error updating store:", updateError);
          throw new Error('Failed to update store');
        }

        return new Response(
          JSON.stringify({
            message: "Store updated successfully",
            storeId: existingStore.id,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'You already have an active store' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new store
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14);
    
    const domainName = `${storeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${user.id.substring(0, 8)}.sokoby.com`;

    const { data: newStore, error: insertError } = await supabase
      .from('store_settings')
      .insert({
        user_id: user.id,
        store_name: storeName,
        store_type: 'manual',
        trial_start_date: trialStartDate.toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        domain_name: domainName,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating store:", insertError);
      throw new Error('Failed to create store');
    }

    console.log("Manual store created:", newStore);

    return new Response(
      JSON.stringify({
        message: "Manual store created successfully",
        storeId: newStore.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in create-manual-store:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
