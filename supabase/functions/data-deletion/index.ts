import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Retourner les instructions de suppression des données au format JSON
  const response = {
    description: "Pour demander la suppression de vos données, veuillez suivre ces étapes :",
    steps: [
      "1. Connectez-vous à votre compte Sokoby",
      "2. Accédez à vos paramètres de compte",
      "3. Cliquez sur 'Supprimer mon compte et mes données'",
      "4. Confirmez la suppression en suivant les instructions"
    ],
    contact: {
      email: "support@sokoby.com",
      subject: "Demande de suppression de données"
    }
  }

  return new Response(
    JSON.stringify(response),
    { 
      headers: corsHeaders,
      status: 200 
    }
  )
})