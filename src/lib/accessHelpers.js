function getSuperAdminEmails() {
  const envEmails = window.__VITE_SUPER_ADMIN_EMAILS__ || import.meta.env.VITE_SUPER_ADMIN_EMAILS || "";
  const parsed = envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return parsed.length
    ? parsed
    : ["waqasdostdost0092@gmail.com", "camthompsonbiz@gmail.com"];
}

export const SUPER_ADMIN_EMAILS = getSuperAdminEmails();

export function isSuperAdminEmail(email) {
  if (!email || typeof email !== "string") return false;
  return getSuperAdminEmails().includes(email.trim().toLowerCase());
}

export function applySuperAdminProfile(profile, user) {
  if (!user?.email) return profile;
  if (!isSuperAdminEmail(user.email)) return profile;
  const base = profile || {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    role: "user",
    approval_status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return {
    ...base,
    email: base.email || user.email,
    role: "admin",
    approval_status: "active",
  };
}

export function hasDashboardAccess(profile, user) {
  const p = applySuperAdminProfile(profile, user);
  if (!p) return false;
  return p.approval_status === "active";
}

export function isAdminProfile(profile, user) {
  const p = applySuperAdminProfile(profile, user);
  return Boolean(p && p.role === "admin" && p.approval_status === "active");
}