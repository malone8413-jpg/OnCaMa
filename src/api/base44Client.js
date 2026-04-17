import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔥 UN SEUL CLIENT (IMPORTANT)
const supabase = createClient(supabaseUrl, supabaseKey);

export const base44 = {
  auth: {
    // LOGIN
    signIn: async (email, password) => {
      return await supabase.auth.signInWithPassword({
        email,
        password,
      });
    },

    // SIGNUP
    signUp: async (email, password) => {
      return await supabase.auth.signUp({
        email,
        password,
      });
    },

    // LOGOUT
    signOut: async () => {
      return await supabase.auth.signOut();
    },

    // GET USER (AVEC ROLE)
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
