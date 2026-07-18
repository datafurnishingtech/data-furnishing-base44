import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { isAdminProfile } from "@/lib/accessHelpers";

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function DFIAdminRoute() {
  const { profile, user, isLoadingProfile } = useAuth();
  if (isLoadingProfile && !profile) return <Spinner />;
  const authUser = user ? { id: user.id, email: user.email } : null;
  if (!isAdminProfile(profile, authUser)) return <Navigate to="/overview" replace />;
  return <Outlet />;
}
