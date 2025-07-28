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
    
    console.log("Sending password reset email to:", email);
    console.log("Reset URL:", confirmationUrl);
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sokoby <onboarding@resend.dev>",
        to: [email],
        subject: "Réinitialisez votre mot de passe Sokoby",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #dc2626; margin: 0; font-size: 28px;">Réinitialisation de mot de passe</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="color: #374151; margin-top: 0;">Demande de réinitialisation reçue</h2>
              
              <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Sokoby. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
              
              <p><strong>Important :</strong> Ce lien expirera dans 1 heure pour votre sécurité.</p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" 
                 style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <div style="margin: 30px 0; padding: 20px; background-color: #fef3f2; border-left: 4px solid #dc2626; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;"><strong>Le bouton ne fonctionne pas ?</strong></p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Copiez et collez ce lien dans votre navigateur :</p>
              <p style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 12px; margin: 10px 0 0 0;">${confirmationUrl}</p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <h3 style="color: #374151; font-size: 16px;">Conseils de sécurité :</h3>
              <ul style="color: #6b7280; font-size: 14px;">
                <li>Ce lien ne peut être utilisé qu'une seule fois</li>
                <li>Il expirera automatiquement dans 1 heure</li>
                <li>Assurez-vous d'être sur le site officiel Sokoby</li>
                <li>Choisissez un mot de passe fort et unique</li>
              </ul>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 20px 0;">
            
            <div style="text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
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
      console.log("Password reset email sent successfully:", data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error("Error sending password reset email:", error);
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in send-reset-password-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);