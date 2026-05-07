import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Shield, TrendingUp, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BrandLogo = ({ dark = false }) => (
  <div className="flex items-center gap-3">
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="2" x2="18" y2="34" stroke="#7B00FF" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="2" y1="18" x2="34" y2="18" stroke="#7B00FF" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="2" y1="9" x2="13" y2="9" stroke="#7B00FF" strokeWidth="4.5" strokeLinecap="round"/>
    </svg>
    <span className={`text-[22px] font-bold tracking-tight ${dark ? "text-white" : "text-foreground"}`}>
      Data Furnishing
    </span>
  </div>
);

const features = [
  { icon: Database, label: "Bureau Coverage Intelligence", desc: "Real-time monitoring across all major credit bureaus" },
  { icon: TrendingUp, label: "Tradeline Analytics", desc: "Deep insights into furnisher performance & trends" },
  { icon: Shield, label: "Verified Data Sources", desc: "Confidence-scored, audit-ready data infrastructure" },
];

export default function AuthLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[52%] bg-[hsl(245,50%,14%)] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
        </div>

        <div className="relative z-10">
          <BrandLogo dark />
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-[32px] font-bold text-white leading-tight tracking-tight">
              Credit Intelligence<br />at Scale
            </h2>
            <p className="text-[14px] text-white/50 mt-3 leading-relaxed max-w-sm">
              The platform trusted by data furnishers, compliance teams, and credit analysts to monitor, verify, and act on bureau data.
            </p>
          </div>

          <div className="space-y-5">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white/90">{label}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-8 pt-2">
            {[["2,847", "Furnishers"], ["24.6M", "Tradelines"], ["98.1%", "Coverage"]].map(([val, lbl]) => (
              <div key={lbl}>
                <p className="text-[20px] font-bold text-white leading-none">{val}</p>
                <p className="text-[9px] text-white/40 mt-1 uppercase tracking-widest">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[10px] text-white/25">© 2025 Data Furnishing. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-[380px]">
          <div className="flex lg:hidden mb-8">
            <BrandLogo />
          </div>

          <div className="mb-8">
            <h1 className="text-[22px] font-bold text-foreground tracking-tight">Welcome back</h1>
            <p className="text-[13px] text-muted-foreground mt-1">Sign in to your Data Furnishing account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-foreground/70 uppercase tracking-wider mb-1.5 block">Email address</label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10 text-[13px] bg-card border-border/60 focus-visible:ring-primary/40"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-foreground/70 uppercase tracking-wider">Password</label>
                <Link to="/auth-forgot" className="text-[11px] text-primary/80 hover:text-primary transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-10 text-[13px] bg-card border-border/60 focus-visible:ring-primary/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input id="remember" type="checkbox" className="w-3.5 h-3.5 accent-primary" />
              <label htmlFor="remember" className="text-[12px] text-muted-foreground cursor-pointer">Keep me signed in</label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 text-[13px] font-semibold bg-primary hover:bg-primary/90 gap-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="text-[11px] text-muted-foreground/60 bg-background px-3">OR</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-10 text-[13px] font-medium border-border/60 gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-[12px] text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/auth-register" className="text-primary font-medium hover:text-primary/80 transition-colors">Request access</Link>
          </p>
        </div>
      </div>
    </div>
  );
}