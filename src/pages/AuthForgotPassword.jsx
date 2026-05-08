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
    <span className="text-[22px] font-bold text-foreground tracking-tight">Data Furnishing</span>
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <div className="flex justify-center mb-8">
          <BrandLogo />
        </div>

        {!sent ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-[20px] font-semibold text-foreground tracking-tight">Reset password</h1>
              <p className="text-[13px] text-muted-foreground mt-1">We'll send a reset link to your email</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email address</label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-9 text-[13px]"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-9 text-[13px] font-medium gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>Send reset link <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </Button>
              </form>
            </div>

            <div className="text-center mt-5">
              <Link to="/auth-login" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to sign in
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-[20px] font-semibold text-foreground tracking-tight">Check your inbox</h1>
              <p className="text-[13px] text-muted-foreground mt-1">Reset link sent</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-1">We've sent a reset link to</p>
              <p className="text-[13px] font-medium text-foreground mb-5">{email}</p>
              <p className="text-[11px] text-muted-foreground/60 mb-5">
                Didn't receive it?{" "}
                <button onClick={() => setSent(false)} className="text-primary hover:underline">Try again</button>
              </p>
              <Link to="/auth-login">
                <Button variant="outline" size="sm" className="text-[12px] h-8 gap-1.5">
                  <ArrowLeft className="w-3 h-3" /> Back to sign in
                </Button>
              </Link>
            </div>
          </>
        )}

        <p className="text-center text-[10px] text-muted-foreground/40 mt-6">© 2025 Data Furnishing</p>
      </div>
    </div>
  );
}