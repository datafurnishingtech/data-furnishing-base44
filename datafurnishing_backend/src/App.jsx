import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider } from "@/lib/AuthContext";
import { SupabaseAuthProvider } from "@/lib/supabaseAuthContext";

import AppLayout from "./components/layout/AppLayout";
import AuthLogin from "./pages/AuthLogin";
import AuthRegister from "./pages/AuthRegister";
import AuthForgotPassword from "./pages/AuthForgotPassword";
import DFIProtectedRoute from "./components/DFIProtectedRoute";
import DFIMarketAccessShell from "./components/DFIMarketAccessShell";
import DFIAdminRoute from "./components/DFIAdminRoute";
import PendingApproval from "./pages/PendingApproval";
import AccessDenied from "./pages/AccessDenied";

const Overview = lazy(() => import("./pages/Overview"));
const Furnishers = lazy(() => import("./pages/Furnishers"));
const FurnisherProfilePage = lazy(() => import("./pages/FurnisherProfilePage"));
const Tradelines = lazy(() => import("./pages/Tradelines"));
const BureauCoverage = lazy(() => import("./pages/BureauCoverage"));
const ProductGraph = lazy(() => import("./pages/ProductGraph"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Watchlists = lazy(() => import("./pages/Watchlists"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const PageSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <SupabaseAuthProvider>
            <Suspense fallback={<PageSpinner />}>
              <Routes>
                {/* Public auth pages */}
                <Route path="/auth-login" element={<AuthLogin />} />
                <Route path="/auth-register" element={<AuthRegister />} />
                <Route path="/auth-forgot-password" element={<AuthForgotPassword />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/access-denied" element={<AccessDenied />} />

                {/* Protected dashboard */}
                <Route element={<DFIProtectedRoute />}>
                  <Route element={<DFIMarketAccessShell />}>
                    <Route element={<AppLayout />}>
                      <Route path="/" element={<Overview />} />
                      <Route path="/furnishers" element={<Furnishers />} />
                      <Route path="/furnishers/:slug" element={<FurnisherProfilePage />} />
                      <Route path="/tradelines" element={<Tradelines />} />
                      <Route path="/tradelines/:slug" element={<Tradelines />} />
                      <Route path="/products/:slug" element={<Tradelines />} />
                      <Route path="/bureau-coverage" element={<BureauCoverage />} />
                      <Route path="/product-graph" element={<ProductGraph />} />
                      <Route path="/alerts" element={<Alerts />} />
                      <Route path="/watchlists" element={<Watchlists />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />

                      {/* Admin-only */}
                      <Route element={<DFIAdminRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>

                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </SupabaseAuthProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;