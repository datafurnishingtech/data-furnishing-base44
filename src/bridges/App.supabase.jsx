import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import AppLayout from './components/layout/AppLayout';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import AuthForgotPassword from './pages/AuthForgotPassword';
import Overview from './pages/Overview';
import Furnishers from './pages/Furnishers';
import FurnisherProfilePage from '@/bridges/pages/FurnisherProfilePage.supabase.jsx';
import Tradelines from './pages/Tradelines';
import BureauCoverage from './pages/BureauCoverage';
import ProductGraph from './pages/ProductGraph';
import Alerts from './pages/Alerts';
import Watchlists from './pages/Watchlists';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminDashboard from '@/bridges/pages/AdminDashboard.supabase.jsx';
import DFIAdminRoute from '@/bridges/components/DFIAdminRoute.supabase.jsx';


const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* "/" is served by the static Framer landing page in production; this
            redirect covers dev mode and any in-app navigation to the root. */}
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/furnishers" element={<Furnishers />} />
        <Route path="/furnishers/:slug" element={<FurnisherProfilePage />} />
        <Route path="/tradelines" element={<Tradelines />} />
        <Route path="/bureau-coverage" element={<BureauCoverage />} />
        <Route path="/product-graph" element={<ProductGraph />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/watchlists" element={<Watchlists />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route element={<DFIAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      <Route path="/auth-login" element={<AuthLogin />} />
      <Route path="/auth-register" element={<AuthRegister />} />
      <Route path="/auth-forgot" element={<AuthForgotPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
