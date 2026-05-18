import { createClient } from "@base44/sdk";
import { appParams } from "@/lib/app-params";
import { supabase } from "@/lib/supabaseClient";
import { fetchMyProfile, ensureProfileRow } from "@/services/profileService";
import { applySuperAdminProfile } from "@/lib/accessHelpers";
import * as bridge from "@/lib/supabaseDataBridge";

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const sdk = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: "",
  requiresAuth: false,
  appBaseUrl,
});

async function mapSupabaseUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    const err = new Error("Not authenticated");
    err.status = 401;
    throw err;
  }
  await ensureProfileRow(user);
  const profile = await fetchMyProfile(user.id);
  const merged = applySuperAdminProfile(profile, user);
  return {
    id: user.id,
    email: user.email,
    full_name:
      merged?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      null,
    role: merged?.role || "user",
    approval_status: merged?.approval_status || "pending",
    created_date: merged?.created_at || user.created_at,
    ...merged,
  };
}

function entityApi({ list, filter }) {
  return {
    list: (sort, limit) => list(sort, limit),
    filter: (filterObj, sort, limit) => filter(filterObj, sort, limit),
  };
}

sdk.auth = {
  ...sdk.auth,
  me: mapSupabaseUser,
  redirectToLogin: (returnUrl) => {
    const target = returnUrl
      ? `/auth-login?from_url=${encodeURIComponent(returnUrl)}`
      : "/auth-login";
    window.location.assign(target);
  },
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_session");
    sessionStorage.clear();
    window.location.href = "/auth-login";
  },
};

sdk.entities = {
  ...sdk.entities,
  Company: entityApi({
    list: bridge.listCompanies,
    filter: bridge.filterCompanies,
  }),
  Product: entityApi({
    list: bridge.listProducts,
    filter: bridge.filterProducts,
  }),
  ProductBureauCoverage: entityApi({
    list: (_sort, limit) => bridge.listProductBureauCoverageAll(limit),
    filter: bridge.filterProductBureauCoverage,
  }),
  Bureau: entityApi({
    list: bridge.listBureaus,
    filter: async (filterObj, sort, limit) => {
      const all = await bridge.listBureaus(sort, limit);
      if (!filterObj || !Object.keys(filterObj).length) return all;
      return all.filter((row) =>
        Object.entries(filterObj).every(([k, v]) => row[k] === v)
      );
    },
  }),
};

export const base44 = sdk;
