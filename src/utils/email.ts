import { supabase } from "@/lib/supabase";

interface SendEmailParams {
  to: string[];
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  try {
    console.log("Attempting to send email to:", to);
    
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: { to, subject, html },
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in sendEmail utility:", error);
    throw error;
  }
};