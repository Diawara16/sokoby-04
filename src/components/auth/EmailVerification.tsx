import { supabase } from "@/lib/supabase";

export const sendVerificationEmail = async (email: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.functions.invoke('send-verification-email', {
        body: {
          email: email,
          confirmationUrl: `${window.location.origin}/verify-email`,
        },
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};