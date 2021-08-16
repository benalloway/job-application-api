const createClient =require("@supabase/supabase-js")

const SUPABASE_PUBLIC_KEY = process.env.SUPABASE_PUBLIC_KEY ?? ""
const SUPABASE_URL = process.env.SUPABASE_URL ?? ""
const supabase = (SUPABASE_PUBLIC_KEY) => {
    return createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    });
  };
  
module.exports = supabase