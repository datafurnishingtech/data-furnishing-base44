import { supabase } from "@/lib/supabaseClient";
import { isSuperAdminEmail } from "@/lib/accessHelpers";

function rpcAdminMissing(error) {
  return error?.code === "PGRST202" || String(error?.message || "").includes("Could not find the function");
}

function normalizeAdminListRpcPayload(data) {
  if (data == null) return null;
  let payload = data;
  if (Array.isArray(payload) && payload.length === 1 && payload[0] && typeof payload[0] === "object") {
    payload = payload[0];
  }
  if (typeof payload === "string") {
    try { payload = JSON.parse(payload); } catch { return null; }
  }
  return payload && typeof payload === "object" ? payload : null;
}

function normalizeAdminProfileRows(rawRows) {
  if (rawRows == null) return [];
  if (Array.isArray(rawRows)) return rawRows;
  if (typeof rawRows === "string") {
    try { const p = JSON.parse(rawRows); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  if (typeof rawRows === "object") {
    const keys = Object.keys(rawRows).filter((k) => /^\d+$/.test(k));
    if (keys.length) return keys.sort((a, b) => Number(a) - Number(b)).map((k) => rawRows[k]).filter(Boolean);
  }
  return [];
}

export async function bootstrapAdminProfileInDb() {
  const { error } = await supabase.rpc("bootstrap_my_admin_profile");
  if (error && !rpcAdminMissing(error)) console.warn("bootstrapAdminProfileInDb:", error.message);
}

export async function fetchMyProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) {
    if (error.code === "PGRST116" || error.message?.includes("relation") || error.message?.includes("does not exist")) return null;
    throw error;
  }
  return data;
}

export async function ensureProfileRow(user) {
  if (!user?.id) return null;
  const existing = await fetchMyProfile(user.id);
  if (existing) return existing;
  const { data, error } = await supabase.from("profiles").insert({
    id: user.id, email: user.email,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    role: "user", approval_status: "pending",
  }).select("*").single();
  if (error) {
    if (error.code === "23505") return fetchMyProfile(user.id);
    console.warn("ensureProfileRow:", error.message);
    return null;
  }
  return data;
}

/** Promote super-admin emails to active admin in DB (RLS + RPCs). */
export async function syncSuperAdminProfile(user) {
  if (!user?.id || !isSuperAdminEmail(user.email)) return null;
  await bootstrapAdminProfileInDb();
  const patch = {
    id: user.id,
    email: user.email,
    role: "admin",
    approval_status: "active",
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
  };
  const { data, error } = await supabase.from("profiles").upsert(patch, { onConflict: "id" }).select("*").single();
  if (!error) return data;
  const { data: updated, error: updateError } = await supabase
    .from("profiles")
    .update({ role: "admin", approval_status: "active", email: user.email })
    .eq("id", user.id)
    .select("*")
    .single();
  if (updateError) console.warn("syncSuperAdminProfile:", updateError.message);
  return updated || null;
}

export async function listProfilesPaged({ page = 1, pageSize = 20, search = "", status = "all" } = {}) {
  const p = Math.max(Number(page) || 1, 1);
  const size = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  await bootstrapAdminProfileInDb();
  const { data: rpcData, error: rpcError } = await supabase.rpc("admin_list_profiles", {
    p_page: p, p_page_size: size, p_status: status || "all", p_search: search || "",
  });
  const rpcPayload = normalizeAdminListRpcPayload(rpcData);
  if (!rpcError && rpcPayload) {
    if (rpcPayload.forbidden) return { rows: [], total: 0, forbidden: true };
    return { rows: normalizeAdminProfileRows(rpcPayload.rows), total: Number(rpcPayload.total) || 0, forbidden: false };
  }
  if (rpcError && !rpcAdminMissing(rpcError)) throw rpcError;
  const from = (p - 1) * size;
  const to = from + size - 1;
  let q = supabase.from("profiles").select("id, email, full_name, role, approval_status, created_at, updated_at", { count: "exact" });
  if (status && status !== "all") q = q.ilike("approval_status", status.trim());
  const term = search.trim();
  if (term) {
    const esc = term.replace(/%/g, "\\%").replace(/_/g, "\\_");
    q = q.or(`email.ilike.%${esc}%,full_name.ilike.%${esc}%`);
  }
  q = q.order("created_at", { ascending: false });
  const { data, error, count } = await q.range(from, to);
  if (error) throw error;
  return { rows: data || [], total: count ?? 0, forbidden: false };
}

export async function updateProfileAccess(userId, patch) {
  const { data, error } = await supabase.from("profiles").update(patch).eq("id", userId).select("*").single();
  if (error) throw error;
  return data;
}

export async function listAuditLogsPaged({ page = 1, pageSize = 25 } = {}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("admin_audit_logs")
    .select("id, actor_id, action, target_id, meta, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) {
    if (error.message?.includes("does not exist")) return { rows: [], total: 0 };
    throw error;
  }
  return { rows: data || [], total: count ?? 0 };
}

export async function logAdminAction(actorId, action, targetId, meta = {}) {
  if (!actorId) return;
  const { error } = await supabase.from("admin_audit_logs").insert({ actor_id: actorId, action, target_id: targetId, meta });
  if (error && !error.message?.includes("does not exist")) console.warn("logAdminAction:", error.message);
}

export async function fetchProfileStats() {
  await bootstrapAdminProfileInDb();
  const { data: rpcData, error: rpcError } = await supabase.rpc("admin_profile_stats");
  const rpcPayload = normalizeAdminListRpcPayload(rpcData);
  if (!rpcError && rpcPayload && typeof rpcPayload === "object" && !rpcPayload.forbidden) {
    return {
      pending: Number(rpcPayload.pending) || 0, active: Number(rpcPayload.active) || 0,
      suspended: Number(rpcPayload.suspended) || 0, rejected: Number(rpcPayload.rejected) || 0,
      total: Number(rpcPayload.total) || 0,
    };
  }
  if (rpcError && !rpcAdminMissing(rpcError)) console.warn("fetchProfileStats RPC:", rpcError.message);
  const [pending, active, suspended, rejected, total] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approval_status", "pending"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approval_status", "active"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approval_status", "suspended"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approval_status", "rejected"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);
  return {
    pending: pending.count || 0, active: active.count || 0,
    suspended: suspended.count || 0, rejected: rejected.count || 0, total: total.count || 0,
  };
}