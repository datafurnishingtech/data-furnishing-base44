import { base44 } from "@/api/base44Client";

/**
 * Fetches data from Supabase via the supabaseData backend function.
 * @param {string} table - "companies" or "products"
 * @param {object} options - { filter, order, limit, select }
 */
export async function supabaseFetch(table, options = {}) {
  const response = await base44.functions.invoke("supabaseData", {
    table,
    ...options,
  });
  return response.data.data;
}