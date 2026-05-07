import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BrandLogo = () => (
  <div className="flex items-center gap-3">
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="2" x2="18" y2="34" stroke="#7B00FF" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="2" y1="18" x2="34" y2="18" stroke="#7B00FF" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="2" y1="9" x2="13" y2="9" stroke="#7B00FF" strokeWidth="4.5" strokeLinecap="round"/>
    </svg>
    <span className="text-[20px] font-bold text-foreground tracking-tight">Data Furnishing</span>
  </div>
);

export default function AuthForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <BrandLogo />
        </div>

        {!sent ? (
          <div className="bg-card rounded-xl border border-border/60 p-8 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <Mail className="w-5 h-5 text-primary" />
            </div>

            <h1 className="text-[20px] font-bold text-foreground tracking-tight mb-1">Reset your password</h1>
            <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed">
              Enter the email address associated with your account and we'll send a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-foreground/70 uppercase tracking-wider mb-1.5 block">Email address</label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-10 text-[13px] bg-background border-border/60 focus-visible:ring-primary/40"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-[13px] font-semibold bg-primary hover:bg-primary/90 gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>Send reset link <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <Link
                to="/auth-login"
                className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border/60 p-8 shadow-sm text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>

            <h2 className="text-[20px] font-bold text-foreground mb-2">Check your inbox</h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-1">
              We've sent a password reset link to
            </p>
            <p className="text-[13px] font-semibold text-foreground mb-6">{email}</p>

            <p className="text-[12px] text-muted-foreground/60 mb-6">
              Didn't receive it? Check your spam folder or{" "}
              <button onClick={() => setSent(false)} className="text-primary hover:underline">try again</button>.
            </p>

            <Link to="/auth-login">
              <Button variant="outline" className="h-9 text-[13px] border-border/60 gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Button>
            </Link>
          </div>
        )}

        <p className="text-center text-[11px] text-muted-foreground/40 mt-8">
          © 2025 Data Furnishing · <span className="hover:text-muted-foreground cursor-pointer">Privacy</span> · <span className="hover:text-muted-foreground cursor-pointer">Terms</span>
        </p>
      </div>
    </div>
  );
}