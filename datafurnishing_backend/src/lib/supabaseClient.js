import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yxmjxfjhaoguozkubgjl.supabase.co";
const supabaseAnonKey = "sb_publishable_z62J5FGS8e7GOIey4XR9QA_15OHsxC4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

export const supabaseConfigured = true;