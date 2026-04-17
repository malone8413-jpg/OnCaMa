import { createClient } from '@supabase/supabase-js'

// récupère les variables .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const base44 = {
  auth: {
    signIn: async (email, password) => {
      return await createClient(supabaseUrl, supabaseKey).auth.signInWithPassword({
        email,
        password
      })
    },

    signUp: async (email, password) => {
      return await createClient(supabaseUrl, supabaseKey).auth.signUp({
        email,
        password
      })
    },

    signOut: async () => {
      return await createClient(supabaseUrl, supabaseKey).auth.signOut()
    },

    getUser: async () => {
      return await createClient(supabaseUrl, supabaseKey).auth.getUser()
    }
  },

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
