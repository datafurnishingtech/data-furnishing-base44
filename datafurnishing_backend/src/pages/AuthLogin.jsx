import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseAuth } from "@/lib/supabaseAuthContext";

const BrandLogo = () => (
  <div className="flex items-center gap-2 mb-8">
    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
      <span className="text-white text-[11px] font-bold">DFI</span>
    </div>
    <span className="text-base font-semibold text-foreground">Data Furnishing</span>
  </div>
);

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-[10px] text-destructive mt-1">{message}</p>;
}

export default function AuthLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithGoogle, isAuthenticated } = useSupabaseAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  React.useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
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
      await login({ email, password });
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (error) {
      setSubmitError(error.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError("");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border/60 rounded-xl shadow-sm p-8">
        <BrandLogo />
        <h1 className="text-[15px] font-semibold text-foreground tracking-tight mb-0.5">Sign in</h1>
        <p className="text-[11px] text-muted-foreground/70 mb-6">Access your credit intelligence workspace</p>

        {submitError && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/8 border border-destructive/20 text-destructive text-[11px]">{submitError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-medium text-foreground/80 block mb-1.5">Email address</label>
            <Input value={email} type="email" autoComplete="email" autoFocus placeholder="you@example.com"
              onChange={(e) => handleChange("email", e.target.value)}
              className={`h-9 text-sm ${errors.email ? "border-destructive" : "border-border/60"}`} />
            <FieldError message={errors.email} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-foreground/80">Password</label>
              <Link to="/auth-forgot-password" className="text-[10px] text-primary/70 hover:text-primary transition-colors">Forgot password?</Link>
            </div>
            <div className="relative">
              <Input value={password} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••"
                onChange={(e) => handleChange("password", e.target.value)}
                className={`h-9 text-sm pr-10 ${errors.password ? "border-destructive" : "border-border/60"}`} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <FieldError message={errors.password} />
          </div>
          <Button type="submit" className="w-full h-9 font-medium text-sm" disabled={loading}>
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Signing in...</> : <>Sign in <ArrowRight className="w-3.5 h-3.5" /></>}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60" /></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wide"><span className="bg-card px-3 text-muted-foreground/50">or</span></div>
        </div>

        <Button variant="outline" className="w-full h-9 text-sm font-normal gap-2 border-border/60 text-foreground/70 hover:bg-muted/50 hover:text-foreground" onClick={() => signInWithGoogle().catch((e) => setSubmitError(e.message || "Google sign-in failed."))}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-[11px] text-muted-foreground/60 mt-6">
          Don't have an account?{" "}
          <Link to="/auth-register" className="text-primary/80 hover:text-primary transition-colors">Request access</Link>
        </p>
        <p className="text-center text-[10px] text-muted-foreground/30 mt-3">© 2026 Data Furnishing Technologies, Inc.</p>
      </div>
    </div>
  );
}