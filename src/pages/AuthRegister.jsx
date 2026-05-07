import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BrandLogo = ({ dark = false }) => (
  <div className="flex items-center gap-3">
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="2" x2="18" y2="34" stroke="#7B00FF" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="2" y1="18" x2="34" y2="18" stroke="#7B00FF" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="2" y1="9" x2="13" y2="9" stroke="#7B00FF" strokeWidth="4.5" strokeLinecap="round"/>
    </svg>
    <span className={`text-[20px] font-bold tracking-tight ${dark ? "text-white" : "text-foreground"}`}>
      Data Furnishing
    </span>
  </div>
);

const perks = [
  "Access 2,800+ verified furnisher profiles",
  "Bureau coverage monitoring & alerts",
  "Tradeline analytics and reporting",
  "Team collaboration & workspace tools",
];

export default function AuthRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", company: "", email: "", password: "", role: "" });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1500);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <BrandLogo />
          <h2 className="text-[22px] font-bold text-foreground mt-6 mb-2">Request submitted!</h2>
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-6">
            Thanks for requesting access to Data Furnishing. Our team will review your application and send an invite to <strong>{form.email}</strong> within 1–2 business days.
          </p>
          <Link to="/auth-login">
            <Button variant="outline" className="text-[13px] h-10 border-border/60">Back to sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[44%] bg-[hsl(245,50%,14%)] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          <BrandLogo dark />
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-[28px] font-bold text-white leading-tight tracking-tight">
              Join the Credit Intelligence Platform
            </h2>
            <p className="text-[13px] text-white/50 mt-3 leading-relaxed">
              Trusted by compliance teams, credit analysts, and data furnishers nationwide.
            </p>
          </div>

          <div className="space-y-3">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <p className="text-[12px] text-white/70">{perk}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {["#4F46E5", "#7C3AED", "#2563EB", "#0891B2"].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-[hsl(245,50%,14%)]" style={{ background: c }} />
              ))}
            </div>
            <p className="text-[11px] text-white/40">500+ professionals already onboard</p>
          </div>
        </div>

        <p className="relative z-10 text-[10px] text-white/25">© 2025 Data Furnishing. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background overflow-y-auto">
        <div className="w-full max-w-[420px]">
          <div className="flex lg:hidden mb-8">
            <BrandLogo />
          </div>

          <div className="mb-7">
            <h1 className="text-[22px] font-bold text-foreground tracking-tight">Request access</h1>
            <p className="text-[13px] text-muted-foreground mt-1">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-foreground/70 uppercase tracking-wider mb-1.5 block">First name</label>
                <Input value={form.firstName} onChange={set("firstName")} placeholder="Alex" className="h-10 text-[13px] bg-card border-border/60" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-foreground/70 uppercase tracking-wider mb-1.5 block">Last name</label>
                <Input value={form.lastName} onChange={set("lastName")} placeholder="Morgan" className="h-10 text-[13px] bg-card border-border/60" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-foreground/70 uppercase tracking-wider mb-1.5 block">Company</label>
              <Input value={form.company} onChange={set("company")} placeholder="Acme Financial" className="h-10 text-[13px] bg-card border-border/60" />
            </div>

            <div>
              <label className="text-[11px] font-medium text-foreground/70 uppercase tracking-wider mb-1.5 block">Work email</label>
              <Input type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" className="h-10 text-[13px] bg-card border-border/60" />
            </div>

            <div>
              <label className="text-[11px] font-medium text-foreground/70 uppercase tracking-wider mb-1.5 block">Your role</label>
              <select
                value={form.role}
                onChange={set("role")}
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-1 text-[13px] text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select your role...</option>
                <option>Data Analyst</option>
                <option>Credit Manager</option>
                <option>Compliance Officer</option>
                <option>Data Engineer</option>
                <option>Executive / Leadership</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-foreground/70 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  className="h-10 text-[13px] bg-card border-border/60 pr-10"
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

            <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
              By creating an account you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and{" "}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 text-[13px] font-semibold bg-primary hover:bg-primary/90 gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <>Request access <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-[12px] text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link to="/auth-login" className="text-primary font-medium hover:text-primary/80 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}