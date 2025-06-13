
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl } = await req.json();
    
    console.log("Sending verification email to:", email);
    console.log("Confirmation URL:", confirmationUrl);
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sokoby <onboarding@resend.dev>",
        to: [email],
        subject: "Vérifiez votre email pour continuer sur Sokoby",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #dc2626; margin: 0;">Bienvenue sur Sokoby !</h1>
              </div>
              
              <h2 style="color: #374151;">Confirmez votre adresse email</h2>
              
              <p>Merci de vous être inscrit sur Sokoby ! Pour continuer la configuration de votre compte et commencer à créer votre boutique en ligne, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmationUrl}" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Vérifier mon email</a>
              </div>
              
              <p>Ou copiez et collez ce lien dans votre navigateur :</p>
              <p style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; word-break: break-all;">${confirmationUrl}</p>
              
              <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">Si vous n'avez pas créé de compte sur Sokoby, vous pouvez ignorer cet email en toute sécurité.</p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                Cet email a été envoyé par Sokoby<br>
                Si vous avez des questions, contactez-nous à support@sokoby.com
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Email sent successfully:", data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
