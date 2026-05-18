import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "@/lib/supabaseAuthContext";

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function DFIProtectedRoute() {
  const { isAuthenticated, isLoadingAuth, authChecked } = useSupabaseAuth();
  const location = useLocation();

  if (isLoadingAuth || !authChecked) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/auth-login" state={{ from: location }} replace />;
  return <Outlet />;
}