import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PasswordStrength from "@/components/auth/PasswordStrength";
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

export default function AuthRegister() {
  const { signUp } = useSupabaseAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", company: "", role: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
    if (submitError) setSubmitError("");
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required.";
    if (!form.lastName.trim()) e.lastName = "Required.";
    if (!form.company.trim()) e.company = "Company name is required.";
    if (!form.role) e.role = "Please select your role.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Must be at least 8 characters.";
    return e;
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 500);
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await signUp({ email: form.email, password: form.password, metadata: { first_name: form.firstName, last_name: form.lastName, company: form.company, role: form.role } });
      setStep(3);
    } catch (error) {
      setSubmitError(error.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <BrandLogo />
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Almost there</h1>
          <p className="text-[12px] text-muted-foreground mb-6">Two steps: verify email, then admin approval</p>
          <div className="bg-muted/50 rounded-lg p-4 text-left text-[11px] text-muted-foreground space-y-2">
            <p>We sent a confirmation link to <strong>{form.email}</strong></p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Click <strong>Confirm your signup</strong> in the email — that only verifies your address.</li>
              <li>After confirming, sign in. You will appear as <strong>pending</strong> until an administrator approves you.</li>
            </ol>
          </div>
          <Link to="/auth-login" className="mt-6 block text-[11px] text-primary hover:underline">Back to sign in</Link>
          <p className="text-[10px] text-muted-foreground/40 mt-4">© 2026 Data Furnishing Technologies, Inc.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <BrandLogo />
        <h1 className="text-xl font-semibold mb-1">{step === 1 ? "Create your account" : "Tell us about yourself"}</h1>
        <p className="text-[12px] text-muted-foreground mb-6">{step === 1 ? "Use any valid email address" : "A few details to complete your request"}</p>

        {submitError && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-[11px]">{submitError}</div>}

        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-foreground/80 block mb-1">Email</label>
              <Input value={form.email} type="email" autoFocus placeholder="you@example.com" onChange={set("email")} className={`h-10 text-[13px] ${errors.email ? "border-destructive" : ""}`} />
              <FieldError message={errors.email} />
            </div>
            <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4 ml-1" /></>}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleStep2} className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground">{form.email}</span>
              <button type="button" onClick={() => { setStep(1); setErrors({}); }} className="text-[10px] text-primary hover:underline">Change</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-foreground/80 block mb-1">First name</label>
                <Input value={form.firstName} placeholder="First" onChange={set("firstName")} className={`h-10 text-[13px] ${errors.firstName ? "border-destructive" : ""}`} />
                <FieldError message={errors.firstName} />
              </div>
              <div>
                <label className="text-[11px] font-medium text-foreground/80 block mb-1">Last name</label>
                <Input value={form.lastName} placeholder="Last" onChange={set("lastName")} className={`h-10 text-[13px] ${errors.lastName ? "border-destructive" : ""}`} />
                <FieldError message={errors.lastName} />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-foreground/80 block mb-1">Company</label>
              <Input value={form.company} placeholder="Your company" onChange={set("company")} className={`h-10 text-[13px] ${errors.company ? "border-destructive" : ""}`} />
              <FieldError message={errors.company} />
            </div>
            <div>
              <label className="text-[11px] font-medium text-foreground/80 block mb-1">Your role</label>
              <Select value={form.role} onValueChange={(v) => { setForm((f) => ({ ...f, role: v })); if (errors.role) setErrors((p) => ({ ...p, role: undefined })); }}>
                <SelectTrigger className={`h-10 text-[13px] ${errors.role ? "border-destructive" : ""}`}><SelectValue placeholder="Select your role…" /></SelectTrigger>
                <SelectContent>
                  {["Data Analyst", "Credit Manager", "Compliance Officer", "Data Engineer", "Executive / Leadership", "Other"].map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.role} />
            </div>
            <div>
              <label className="text-[11px] font-medium text-foreground/80 block mb-1">Create a password</label>
              <div className="relative">
                <Input value={form.password} type={showPassword ? "text" : "password"} onChange={set("password")} className={`h-10 text-[13px] pr-10 ${errors.password ? "border-destructive" : ""}`} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
              <FieldError message={errors.password} />
            </div>
            <Button type="submit" className="w-full h-10 font-medium mt-1" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Request access <ArrowRight className="w-4 h-4 ml-1" /></>}
            </Button>
          </form>
        )}

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          Already have an account?{" "}<Link to="/auth-login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-[10px] text-muted-foreground/40 mt-4">© 2026 Data Furnishing Technologies, Inc.</p>
      </div>
    </div>
  );
}