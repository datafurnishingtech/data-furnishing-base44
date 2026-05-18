import {
  listProfilesPaged,
  fetchProfileStats,
  updateProfileAccess,
  listAuditLogsPaged,
  bootstrapAdminProfileInDb,
  logAdminAction,
} from "@/services/profileService";
import { supabase } from "@/lib/supabaseClient";

export {
  listProfilesPaged,
  fetchProfileStats,
  bootstrapAdminProfileInDb,
};

export async function fetchAuditLogs({ page = 1, pageSize = 25 } = {}) {
  return listAuditLogsPaged({ page, pageSize });
}

export async function approveProfile(userId, actorId) {
  const row = await updateProfileAccess(userId, { approval_status: "active" });
  if (actorId) {
    await logAdminAction(actorId, "approve_profile", userId, { approval_status: "active" });
  }
  return row;
}

export async function rejectProfile(userId, actorId) {
  const row = await updateProfileAccess(userId, { approval_status: "rejected" });
  if (actorId) {
    await logAdminAction(actorId, "reject_profile", userId, { approval_status: "rejected" });
  }
  return row;
}

export async function suspendProfile(userId, actorId) {
  const row = await updateProfileAccess(userId, { approval_status: "suspended" });
  if (actorId) {
    await logAdminAction(actorId, "suspend_profile", userId, { approval_status: "suspended" });
  }
  return row;
}

export async function getCurrentAdminSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
