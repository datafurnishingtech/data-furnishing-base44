import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import { ensureProfileRow, fetchMyProfile, syncSuperAdminProfile } from "@/services/profileService";
import { applySuperAdminProfile, hasDashboardAccess, isSuperAdminEmail } from "@/lib/accessHelpers";

function mapSupabaseAuthError(error) {
  const msg = error?.message || "";
  if (/email not confirmed/i.test(msg)) {
    return new Error("Please confirm your email first — check your inbox for the Supabase signup link, then try again.");
  }
  if (/invalid login credentials/i.test(msg)) {
    return new Error("Invalid email or password. Use the same email/password as in Supabase Auth (Authentication → Users).");
  }
  return new Error(msg || "Sign in failed.");
}

const AuthContext = createContext();
const PUBLIC_PATHS = /^\/(auth-login|auth-register|auth-forgot)(\/|$)/;
const accessGateEnabled = import.meta.env.VITE_ENABLE_ACCESS_GATE !== "false";

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label || "Request"} timed out`)), ms)
    ),
  ]);
}

function isPublicPath() {
  return PUBLIC_PATHS.test(window.location.pathname);
}

function toContextUser(supabaseUser, profile) {
  if (!supabaseUser) return null;
  const merged = applySuperAdminProfile(profile, supabaseUser);
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    full_name:
      merged?.full_name ||
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      null,
    role: merged?.role || "user",
    approval_status: merged?.approval_status || "pending",
    ...merged,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: "supabase", public_settings: {} });

  const applySession = useCallback(async (session) => {
    const supabaseUser = session?.user || null;
    if (!supabaseUser) {
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      if (!isPublicPath()) {
        setAuthError({ type: "auth_required", message: "Authentication required" });
      } else {
        setAuthError(null);
      }
      return;
    }

    let profileRow = null;
    setIsLoadingProfile(true);
    try {
      if (accessGateEnabled) {
        try {
          await withTimeout(ensureProfileRow(supabaseUser), 8000, "Profile setup");
          if (isSuperAdminEmail(supabaseUser.email)) {
            profileRow = await withTimeout(syncSuperAdminProfile(supabaseUser), 8000, "Admin profile");
          }
          if (!profileRow) {
            profileRow = await withTimeout(fetchMyProfile(supabaseUser.id), 8000, "Profile load");
          }
        } catch (profileErr) {
          console.warn("applySession profile:", profileErr?.message || profileErr);
          if (isSuperAdminEmail(supabaseUser.email)) {
            profileRow = applySuperAdminProfile(null, supabaseUser);
          }
        }
      } else {
        profileRow = applySuperAdminProfile(
          {
            id: supabaseUser.id,
            email: supabaseUser.email,
            full_name: supabaseUser.user_metadata?.full_name || null,
            role: "user",
            approval_status: "active",
          },
          supabaseUser
        );
      }
      setProfile(applySuperAdminProfile(profileRow, supabaseUser));
    } finally {
      setIsLoadingProfile(false);
    }

    const contextUser = toContextUser(supabaseUser, profileRow);
    const allowed = !accessGateEnabled || hasDashboardAccess(profileRow, supabaseUser);

    if (!allowed && !isPublicPath()) {
      setUser(contextUser);
      setIsAuthenticated(true);
      setAuthError({
        type: "user_not_registered",
        message: "Your account is pending administrator approval.",
      });
      return;
    }

    setUser(contextUser);
    setIsAuthenticated(true);
    setAuthError(null);
  }, []);

  const checkUserAuth = useCallback(async () => {
    try {
      setIsLoadingAuth(true);
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      await applySession(data.session);
      setAuthChecked(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
      if (!isPublicPath()) {
        setAuthError({
          type: "auth_required",
          message: error.message || "Authentication required",
        });
      }
    } finally {
      setIsLoadingAuth(false);
    }
  }, [applySession]);

  const checkAppState = useCallback(async () => {
    setIsLoadingPublicSettings(true);
    setAppPublicSettings({ id: "supabase", public_settings: {} });
    await checkUserAuth();
    setIsLoadingPublicSettings(false);
  }, [checkUserAuth]);

  useEffect(() => {
    let mounted = true;

    const finishLoading = () => {
      if (!mounted) return;
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);
    };

    const hydrate = async () => {
      setIsLoadingAuth(true);
      setIsLoadingPublicSettings(true);
      setAppPublicSettings({ id: "supabase", public_settings: {} });
      try {
        const supabase = await getSupabase();
      const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) throw error;
        await applySession(data.session);
        setAuthChecked(true);
      } catch (error) {
        if (!mounted) return;
        setUser(null);
        setIsAuthenticated(false);
        setAuthChecked(true);
        if (!isPublicPath()) {
          setAuthError({
            type: "auth_required",
            message: error.message || "Authentication required",
          });
        }
      } finally {
        finishLoading();
      }
    };

    hydrate();

    let listener = null;

    const setupAuthListener = async () => {
      const supabase = await getSupabase();
      if (!mounted) return;
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "INITIAL_SESSION") return;
        setTimeout(async () => {
          if (!mounted) return;
          try {
            await applySession(session);
            setAuthChecked(true);
          } catch (e) {
            console.warn("auth state change:", e?.message || e);
          } finally {
            finishLoading();
          }
        }, 0);
      });
      listener = data;
    };

    setupAuthListener();

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [applySession]);

  const login = async ({ email, password }) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (error) throw mapSupabaseAuthError(error);

    if (accessGateEnabled && data.user) {
      await ensureProfileRow(data.user);
      if (isSuperAdminEmail(data.user.email)) {
        await syncSuperAdminProfile(data.user);
      }
    }

    await applySession(data.session);

    if (accessGateEnabled && data.user && !hasDashboardAccess(await fetchMyProfile(data.user.id), data.user)) {
      await supabase.auth.signOut();
      throw new Error(
        `Your account is pending approval. Admin access requires your exact login email in VITE_SUPER_ADMIN_EMAILS (.env.local). You signed in as: ${data.user.email}`
      );
    }

    setAuthChecked(true);
    return data;
  };

  const signUp = async ({ email, password, metadata }) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth-login`,
      },
    });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email) => {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth-login`,
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/overview` },
    });
    if (error) throw error;
  };

  const logout = useCallback(async () => {
    const supabase = await getSupabase();
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    setAuthError(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_session");
    sessionStorage.clear();
    window.location.href = "/auth-login";
  }, []);

  const navigateToLogin = () => {
    window.location.assign("/auth-login");
  };

  const refreshProfile = useCallback(async () => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    await applySession(data.session);
  }, [applySession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        isLoadingProfile,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
        refreshProfile,
        login,
        signUp,
        resetPassword,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};