import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { reward_id } = await req.json();

    // Récupérer les informations de la récompense
    const { data: reward, error: rewardError } = await supabaseClient
      .from('loyalty_rewards')
      .select('*')
      .eq('id', reward_id)
      .single();

    if (rewardError) throw rewardError;

    // Récupérer les points de fidélité de l'utilisateur
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: loyaltyPoints, error: pointsError } = await supabaseClient
      .from('loyalty_points')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (pointsError) throw pointsError;

    // Vérifier si l'utilisateur a assez de points
    if (loyaltyPoints.points < reward.points_cost) {
      throw new Error('Not enough points');
    }

    // Vérifier si l'utilisateur a le niveau requis
    if (loyaltyPoints.current_tier < reward.minimum_tier) {
      throw new Error('Tier level too low');
    }

    // Mettre à jour les points
    const { error: updateError } = await supabaseClient
      .from('loyalty_points')
      .update({ points: loyaltyPoints.points - reward.points_cost })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    // Enregistrer l'historique
    const { error: historyError } = await supabaseClient
      .from('loyalty_points_history')
      .insert({
        user_id: user.id,
        points_change: -reward.points_cost,
        reason: `Récompense échangée: ${reward.name}`
      });

    if (historyError) throw historyError;

    // Créer une notification
    const { error: notifError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: user.id,
        title: 'Récompense échangée',
        content: `Vous avez échangé ${reward.points_cost} points contre ${reward.name}`
      });

    if (notifError) throw notifError;

    return new Response(
      JSON.stringify({ success: true, reward }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});