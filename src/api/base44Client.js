import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const base44 = {
  auth: {
    signIn: async (email, password) => {
      return await supabase.auth.signInWithPassword({
        email,
        password,
      });
    },

    signUp: async (email, password) => {
      return await supabase.auth.signUp({
        email,
        password,
      });
    },

    signOut: async () => {
      return await supabase.auth.signOut();
    },

    getUser: async () => {
      const result = await supabase.auth.getUser();

      if (result?.data?.user) {
        result.data.user = {
          ...result.data.user,
          role: result.data.user.user_metadata?.role || null,
        };
      }

      return result;
    },
  },
};
