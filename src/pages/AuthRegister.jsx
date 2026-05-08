import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BrandLogo = () => (
  <img src="https://media.base44.com/images/public/69f90686411a7f6520cfe22a/4859ca4a2_MainSignature.png" alt="Data Furnishing" className="h-6 w-auto" />
);

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-[11px] text-destructive mt-1">{message}</p>;
}

export default function AuthRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", company: "", email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required.";
    if (!form.lastName.trim()) e.lastName = "Required.";
    if (!form.company.trim()) e.company = "Company name is required.";
    if (!form.email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.role) e.role = "Please select your role.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1500);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[380px] text-center">
          <div className="flex justify-center mb-10"><BrandLogo /></div>
          <div className="mb-7 text-center">
            <h1 className="text-[19px] font-semibold text-foreground tracking-tight">Request submitted</h1>
            <p className="text-[12.5px] text-muted-foreground mt-1.5">We'll be in touch shortly</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-7 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-1">
              Our team will review your application and send an invite to
            </p>
            <p className="text-[13px] font-medium text-foreground mb-5">{form.email}</p>
            <p className="text-[11px] text-muted-foreground/60 mb-5">Expect a response within 1–2 business days.</p>
            <Link to="/auth-login">
              <Button variant="outline" size="sm" className="text-[12px] h-8">Back to sign in</Button>
            </Link>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/40 mt-8">© 2026 Data Furnishing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center mb-10">
          <BrandLogo />
        </div>

        <div className="mb-7 text-center">
          <h1 className="text-[19px] font-semibold text-foreground tracking-tight">Request access</h1>
          <p className="text-[12.5px] text-muted-foreground mt-1.5">Tell us about yourself to get started</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">First name</label>
                <Input value={form.firstName} onChange={set("firstName")} placeholder="Alex" className={`h-10 text-[13px] ${errors.firstName ? "border-destructive" : ""}`} autoComplete="given-name" />
                <FieldError message={errors.firstName} />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Last name</label>
                <Input value={form.lastName} onChange={set("lastName")} placeholder="Morgan" className={`h-10 text-[13px] ${errors.lastName ? "border-destructive" : ""}`} autoComplete="family-name" />
                <FieldError message={errors.lastName} />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Company</label>
              <Input value={form.company} onChange={set("company")} placeholder="Acme Financial" className={`h-10 text-[13px] ${errors.company ? "border-destructive" : ""}`} autoComplete="organization" />
              <FieldError message={errors.company} />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Work email</label>
              <Input type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" className={`h-10 text-[13px] ${errors.email ? "border-destructive" : ""}`} autoComplete="email" />
              <FieldError message={errors.email} />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Your role</label>
              <select
                value={form.role}
                onChange={set("role")}
                className={`flex h-10 w-full rounded-md border bg-transparent px-3 text-[13px] text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${errors.role ? "border-destructive" : "border-input"}`}
              >
                <option value="">Select your role…</option>
                <option>Data Analyst</option>
                <option>Credit Manager</option>
                <option>Compliance Officer</option>
                <option>Data Engineer</option>
                <option>Executive / Leadership</option>
                <option>Other</option>
              </select>
              <FieldError message={errors.role} />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  className={`h-10 text-[13px] pr-10 ${errors.password ? "border-destructive" : ""}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <FieldError message={errors.password} />
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              By requesting access you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and{" "}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            <Button type="submit" disabled={loading} className="w-full h-10 text-[13px] font-medium gap-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : (
                <>Request access <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-[12px] text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/auth-login" className="text-primary font-medium hover:text-primary/80 transition-colors">Sign in</Link>
        </p>

        <p className="text-center text-[10px] text-muted-foreground/40 mt-6">© 2026 Data Furnishing</p>
      </div>
    </div>
  );
}