import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ensureProfileRow, fetchMyProfile } from "@/services/profileService";
import { applySuperAdminProfile } from "@/lib/accessHelpers";

const SupabaseAuthContext = createContext(null);

const accessGateEnabled = import.meta.env.VITE_ENABLE_ACCESS_GATE !== "false";

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const profileLoadDepthRef = React.useRef(0);

  const refreshProfile = useCallback(async (u) => {
    if (!u?.id) { setProfile(null); return null; }
    if (!accessGateEnabled) {
      const synthetic = {
        id: u.id, email: u.email,
        full_name: u.user_metadata?.full_name || null,
        role: "user", approval_status: "active",
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      const merged = applySuperAdminProfile(synthetic, u);
      setProfile(merged);
      return merged;
    }
    profileLoadDepthRef.current += 1;
    setIsLoadingProfile(true);
    const load = async () => {
      await ensureProfileRow(u);
      const row = await fetchMyProfile(u.id);
      let merged = applySuperAdminProfile(row, u);
      if (!merged && u?.id) {
        merged = applySuperAdminProfile({
          id: u.id, email: u.email,
          full_name: u.user_metadata?.full_name || u.user_metadata?.name || null,
          role: "user", approval_status: "pending",
          created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        }, u);
      }
      setProfile(merged);
      return merged;
    };
    try {
      return await Promise.race([
        load(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Profile timeout")), 25000)),
      ]);
    } catch (e) {
      console.warn("refreshProfile:", e?.message || e);
      const fallback = u?.id && applySuperAdminProfile({
        id: u.id, email: u.email,
        full_name: u.user_metadata?.full_name || u.user_metadata?.name || null,
        role: "user", approval_status: "pending",
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }, u);
      setProfile(fallback || null);
      return fallback || null;
    } finally {
      profileLoadDepthRef.current = Math.max(0, profileLoadDepthRef.current - 1);
      setIsLoadingProfile(profileLoadDepthRef.current > 0);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const hydrateSession = async () => {
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) {
        setAuthError({ type: "auth_required", message: error.message });
        setUser(null); setSession(null); setIsAuthenticated(false); setProfile(null);
      } else {
        setSession(data.session);
        const nextUser = data.session?.user || null;
        setUser(nextUser); setIsAuthenticated(Boolean(data.session)); setAuthError(null);
        if (nextUser) await refreshProfile(nextUser); else setProfile(null);
      }
      setAuthChecked(true); setIsLoadingAuth(false);
    };
    hydrateSession();
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      const nextUser = nextSession?.user || null;
      setUser(nextUser); setIsAuthenticated(Boolean(nextSession)); setAuthError(null); setAuthChecked(true);
      const waitForProfile = (event === "INITIAL_SESSION" || event === "SIGNED_IN") && Boolean(nextUser);
      if (!waitForProfile) setIsLoadingAuth(false);
      if (nextUser) await refreshProfile(nextUser); else setProfile(null);
      if (mounted && waitForProfile) setIsLoadingAuth(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [refreshProfile]);

  const checkUserAuth = useCallback(async () => {
    try {
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      const { data: sessionData } = await supabase.auth.getSession();
      setUser(data.user); setSession(sessionData.session);
      setIsAuthenticated(Boolean(data.user)); setAuthError(null); setAuthChecked(true);
      if (data.user) await refreshProfile(data.user); else setProfile(null);
    } catch (error) {
      setIsLoadingAuth(false); setIsAuthenticated(false);
      setUser(null); setSession(null); setProfile(null); setAuthChecked(true);
      setAuthError({ type: "auth_required", message: error.message || "Authentication required" });
      return null;
    } finally {
      setIsLoadingAuth(false);
    }
  }, [refreshProfile]);

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session); setUser(data.user); setIsAuthenticated(true); setAuthChecked(true);
    await refreshProfile(data.user);
    return data;
  };

  const signUp = async ({ email, password, metadata }) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: metadata, emailRedirectTo: `${window.location.origin}/pending-approval` },
    });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth-login`,
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) throw error;
  };

  const logout = useCallback(async (shouldRedirect = true) => {
    try {
      await Promise.race([
        supabase.auth.signOut({ scope: "local" }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 8000)),
      ]);
    } catch {
      try { await supabase.auth.signOut({ scope: "global" }); } catch { /* ignore */ }
    }
    setUser(null); setSession(null); setIsAuthenticated(false);
    setProfile(null); setAuthChecked(true); setIsLoadingAuth(false);
    if (shouldRedirect) window.location.assign(`${window.location.origin}/auth-login`);
  }, []);

  const navigateToLogin = () => { window.location.assign("/auth-login"); };

  return (
    <SupabaseAuthContext.Provider value={{
      user, session, isAuthenticated, isLoadingAuth, isLoadingPublicSettings,
      isLoadingProfile, profile, authError, authChecked,
      login, signUp, resetPassword, signInWithGoogle, logout,
      refreshProfile, checkUserAuth, navigateToLogin,
      checkAppState: checkUserAuth,
    }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  return context;
};