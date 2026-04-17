import { createClient } from '@supabase/supabase-js'

// récupère les variables .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const base44 = {
  auth: {
 signIn: async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

signUp: async (email, password) => {
  return await supabase.auth.signUp({
    email,
    password
  });
},

  signOut: async () => {
  return await supabase.auth.signOut();
}

getUser: async () => {
  const result = await supabase.auth.getUser();

  if (result?.data?.user) {
    result.data.user = {
      ...result.data.user,
      role: result.data.user.user_metadata?.role || null
    };
  }

  return result;
}
  db: {
    getAll: async (table) => {
      return await createClient(supabaseUrl, supabaseKey).from(table).select('*')
    },

    insert: async (table, data) => {
      return await createClient(supabaseUrl, supabaseKey).from(table).insert(data)
    },

    update: async (table, id, data) => {
      return await createClient(supabaseUrl, supabaseKey)
        .from(table)
        .update(data)
        .eq('id', id)
    },

    delete: async (table, id) => {
      return await createClient(supabaseUrl, supabaseKey)
        .from(table)
        .delete()
        .eq('id', id)
    }
  }
}
