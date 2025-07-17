import { supabase } from '@/integrations/supabase/client';
import { logAuthError, retryWithBackoff } from '@/utils/authErrorHandler';

export const emailService = {
  async resendConfirmation(email: string) {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) throw error;
        return { data, error: null };
      });

      return result;
    } catch (error) {
      logAuthError(error, 'RESEND_CONFIRMATION', email);
      return { data: null, error };
    }
  },

  async resetPassword(email: string) {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });

        if (error) throw error;
        return { data, error: null };
      });

      return result;
    } catch (error) {
      logAuthError(error, 'PASSWORD_RESET', email);
      return { data: null, error };
    }
  }
};