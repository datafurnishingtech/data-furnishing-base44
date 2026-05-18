import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "@/lib/supabaseAuthContext";
import { hasDashboardAccess } from "@/lib/accessHelpers";

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function DFIMarketAccessShell() {
  const { profile, user, isLoadingProfile } = useSupabaseAuth();

  if (isLoadingProfile && !profile) return <Spinner />;
  if (!profile) return <Navigate to="/pending-approval" replace />;

  if (!hasDashboardAccess(profile, user)) {
    const status = profile.approval_status;
    if (status === "pending") return <Navigate to="/pending-approval" replace />;
    if (status === "rejected") return <Navigate to="/access-denied?reason=rejected" replace />;
    if (status === "suspended") return <Navigate to="/access-denied?reason=suspended" replace />;
    return <Navigate to="/pending-approval" replace />;
  }

  return <Outlet />;
}