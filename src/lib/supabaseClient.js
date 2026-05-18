import { createClient } from "@supabase/supabase-js";
import { base44 } from "@/api/base44Client";

const authOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
};

let runtimeConfigPromise = null;
const viteSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const viteSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export let supabaseConfigured = Boolean(viteSupabaseUrl && viteSupabaseAnonKey);
export let supabase = createClient(
  viteSupabaseUrl || "https://placeholder.supabase.co",
  viteSupabaseAnonKey || "placeholder",
  authOptions
);

async function loadRuntimeConfig() {
  if (!runtimeConfigPromise) {
    runtimeConfigPromise = base44.functions.invoke("getSupabaseConfig", {}).then((response) => response.data);
  }
  return runtimeConfigPromise;
}

export async function getSupabase() {
  if (supabaseConfigured) return supabase;

  const config = await loadRuntimeConfig();
  const supabaseUrl = config?.supabaseUrl;
  const supabaseAnonKey = config?.supabaseAnonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase config is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Base44 secrets.");
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, authOptions);
  supabaseConfigured = true;

  if (config.enableAccessGate) window.__VITE_ENABLE_ACCESS_GATE__ = config.enableAccessGate;
  if (config.superAdminEmails) window.__VITE_SUPER_ADMIN_EMAILS__ = config.superAdminEmails;

  return supabase;
}