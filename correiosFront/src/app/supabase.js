
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://szmxzwdyhhptgcmdocol.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bXh6d2R5aGhwdGdjbWRvY29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4MzA1MTYsImV4cCI6MjAzMjQwNjUxNn0.u8ud3YilsqgkaJAwYyX02lfpKqNVA0-1AZhprvU1UG4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
