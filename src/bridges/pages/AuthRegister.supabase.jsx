import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordStrength from "@/components/auth/PasswordStrength";
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

export default function AuthRegister() {
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", company: "", role: "", password: "" });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
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
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 800);
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitError("");
    setLoading(true);
    try {
      await signUp({
        email: form.email,
        password: form.password,
        metadata: {
          full_name: `${form.firstName} ${form.lastName}`.trim(),
          first_name: form.firstName,
          last_name: form.lastName,
          company: form.company,
          requested_role: form.role,
        },
      });
      setStep(3);
    } catch (error) {
      setSubmitError(error.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <AuthShell maxWidth="max-w-[400px]">
        <div className="flex justify-center mb-10"><AuthBrandLogo /></div>
        <AuthTitle title="Request submitted" subtitle="We'll be in touch shortly" />
        <AuthCard>
          <div className="text-center">
            <div className="w-11 h-11 rounded-full bg-[#6e05ff]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#6e05ff]" />
            </div>
            <p className="text-[13px] text-black/55 leading-relaxed mb-1">Access request received for</p>
            <p className="text-[13px] font-medium text-[#050505] mb-5">{form.email}</p>
            <p className="text-[11px] text-black/40 mb-5">Our team will review your application within 1–2 business days.</p>
            <Link to="/auth-login">
              <Button variant="outline" size="sm" className="df-auth-outline text-[12px] h-8 !h-8 px-4">Back to sign in</Button>
            </Link>
          </div>
        </AuthCard>
        <AuthCopyright />
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="flex justify-center mb-10"><AuthBrandLogo /></div>

      <AuthTitle
        title={step === 1 ? "Request access" : "Tell us about yourself"}
        subtitle={step === 1 ? "Start with your email" : "A few details to complete your request"}
      />

      <AuthCard>
        {submitError && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-destructive/8 border border-destructive/20 text-[12px] text-destructive">
            {submitError}
          </div>
        )}
        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-4" noValidate>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@email.com"
                className={errors.email ? "border-destructive" : ""}
                autoComplete="email"
                autoFocus
              />
              <FieldError message={errors.email} />
            </div>
            <Button type="submit" disabled={loading} className="w-full gap-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Checking…
                </span>
              ) : <>Continue <ArrowRight className="w-3.5 h-3.5" /></>}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleStep2} className="space-y-4" noValidate>
            <div className="flex items-center gap-2 mb-1 p-2.5 rounded-full bg-black/[0.03] border border-black/10">
              <span className="text-[11px] text-black/55 flex-1 truncate pl-2">{form.email}</span>
              <button type="button" onClick={() => { setStep(1); setErrors({}); }} className="text-[10px] text-[#6e05ff] hover:underline flex-shrink-0 pr-2">Change</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">First name</label>
                <Input value={form.firstName} onChange={set("firstName")} placeholder="Alex" className={errors.firstName ? "border-destructive" : ""} autoComplete="given-name" />
                <FieldError message={errors.firstName} />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">Last name</label>
                <Input value={form.lastName} onChange={set("lastName")} placeholder="Morgan" className={errors.lastName ? "border-destructive" : ""} autoComplete="family-name" />
                <FieldError message={errors.lastName} />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">Company</label>
              <Input value={form.company} onChange={set("company")} placeholder="Acme Financial" className={errors.company ? "border-destructive" : ""} autoComplete="organization" />
              <FieldError message={errors.company} />
            </div>

            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">Your role</label>
              <select
                value={form.role}
                onChange={set("role")}
                className={`flex w-full ${errors.role ? "border-destructive" : ""}`}
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
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">Create a password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
              <FieldError message={errors.password} />
            </div>

            <p className="text-[11px] text-black/45 leading-relaxed">
              By requesting access you agree to our{" "}
              <Link to="/legal/privacy-policy" className="font-medium hover:underline">Privacy Policy</Link>.
            </p>

            <Button type="submit" disabled={loading} className="w-full gap-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : <>Request access <ArrowRight className="w-3.5 h-3.5" /></>}
            </Button>
          </form>
        )}
      </AuthCard>

      <AuthFooterNote>
        Already have an account?{" "}
        <Link to="/auth-login" className="font-semibold">Sign in</Link>
      </AuthFooterNote>
      <AuthCopyright />
    </AuthShell>
  );
}
