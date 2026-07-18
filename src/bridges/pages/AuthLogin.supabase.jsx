import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AuthBrandLogo,
  AuthCard,
  AuthCopyright,
  AuthFooterNote,
  AuthShell,
  AuthTitle,
} from "@/components/auth/AuthShell";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-[11px] text-destructive mt-1">{message}</p>;
}

export default function AuthLogin() {
  const navigate = useNavigate();
  const { login, signInWithGoogle, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/overview", { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate("/overview", { replace: true });
    } catch (error) {
      console.error("[auth-login]", error);
      setSubmitError(error?.message || "Sign in failed. Check Supabase Authentication → Users for this email/password.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError("");
  };

  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle title="Sign in" subtitle="Access your credit intelligence workspace" />

      <AuthCard>
        {submitError && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-destructive/8 border border-destructive/20 text-[12px] text-destructive">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">Email address</label>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => handleChange("email", e.target.value)}
              className={errors.email ? "border-destructive focus-visible:ring-destructive/30" : ""}
              autoComplete="email"
            />
            <FieldError message={errors.email} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wider">Password</label>
              <Link to="/auth-forgot" className="text-[11px] font-medium transition-colors">Forgot password?</Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => handleChange("password", e.target.value)}
                className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <FieldError message={errors.password} />
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <input id="remember" type="checkbox" className="w-3.5 h-3.5 accent-[#6e05ff] rounded" />
            <label htmlFor="remember" className="text-[12px] text-black/55 cursor-pointer select-none !tracking-normal !normal-case">Keep me signed in</label>
          </div>

          <Button type="submit" disabled={loading} className="w-full gap-2 mt-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>Sign in <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </Button>
        </form>

        <div className="df-auth-divider text-center">
          <span>or</span>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={async () => { try { await signInWithGoogle(); } catch (err) { setSubmitError(err.message || "Google sign-in failed."); } }}
          className="df-auth-outline w-full gap-2"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>
      </AuthCard>

      <AuthFooterNote>
        Don't have an account?{" "}
        <Link to="/auth-register" className="font-semibold">Request access</Link>
      </AuthFooterNote>

      <AuthCopyright />
    </AuthShell>
  );
}
