import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BrandLogo = () => (
  <div className="flex items-center gap-2.5">
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="2" x2="18" y2="34" stroke="hsl(var(--primary))" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="2" y1="18" x2="34" y2="18" stroke="hsl(var(--primary))" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="2" y1="9" x2="13" y2="9" stroke="hsl(var(--primary))" strokeWidth="4.5" strokeLinecap="round"/>
    </svg>
    <span className="text-[17px] font-semibold text-foreground tracking-tight">Data Furnishing</span>
  </div>
);

export default function AuthRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[380px] text-center">
          <div className="flex justify-center mb-8"><BrandLogo /></div>
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <h2 className="text-[17px] font-semibold text-foreground mb-2">Request submitted</h2>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-5">
              Our team will review your application and send an invite to <span className="text-foreground font-medium">{form.email}</span> within 1–2 business days.
            </p>
            <Link to="/auth-login">
              <Button variant="outline" size="sm" className="text-[12px] h-8">Back to sign in</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center mb-8">
          <BrandLogo />
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-[20px] font-semibold text-foreground tracking-tight">Request access</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Create your account to get started</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">First name</label>
                <Input value={form.firstName} onChange={set("firstName")} placeholder="Alex" className="h-9 text-[13px]" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Last name</label>
                <Input value={form.lastName} onChange={set("lastName")} placeholder="Morgan" className="h-9 text-[13px]" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Company</label>
              <Input value={form.company} onChange={set("company")} placeholder="Acme Financial" className="h-9 text-[13px]" />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Work email</label>
              <Input type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" className="h-9 text-[13px]" />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Your role</label>
              <select
                value={form.role}
                onChange={set("role")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-[13px] text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
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
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  className="h-9 text-[13px] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              By creating an account you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and{" "}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            <Button type="submit" disabled={loading} className="w-full h-9 text-[13px] font-medium gap-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <>Request access <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-[12px] text-muted-foreground mt-5">
          Already have an account?{" "}
          <Link to="/auth-login" className="text-primary font-medium hover:text-primary/80 transition-colors">Sign in</Link>
        </p>

        <p className="text-center text-[10px] text-muted-foreground/40 mt-6">© 2025 Data Furnishing</p>
      </div>
    </div>
  );
}