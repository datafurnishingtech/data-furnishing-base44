import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSupabaseAuth } from "@/lib/supabaseAuthContext";
import { isAdminProfile } from "@/lib/accessHelpers";

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function DFIAdminRoute() {
  const { profile, user, isLoadingProfile } = useSupabaseAuth();
  if (isLoadingProfile && !profile) return <Spinner />;
  if (!isAdminProfile(profile, user)) return <Navigate to="/" replace />;
  return <Outlet />;
}