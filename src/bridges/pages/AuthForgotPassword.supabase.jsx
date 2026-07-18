import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AuthBrandLogo,
  AuthCard,
  AuthCopyright,
  AuthShell,
  AuthTitle,
} from "@/components/auth/AuthShell";

export default function AuthForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address."); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell maxWidth="max-w-[400px]">
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      {!sent ? (
        <>
          <AuthTitle title="Reset your password" subtitle="We'll send a reset link to your email" />

          <AuthCard>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">Email address</label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (error) setError(""); }}
                  className={error ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  autoComplete="email"
                />
                {error && <p className="text-[11px] text-destructive mt-1">{error}</p>}
              </div>

              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>Send reset link <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </Button>
            </form>
          </AuthCard>

          <div className="text-center mt-5">
            <Link to="/auth-login" className="inline-flex items-center gap-1.5 text-[12px] text-black/55 hover:text-[#050505] transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to sign in
            </Link>
          </div>
        </>
      ) : (
        <>
          <AuthTitle title="Check your inbox" subtitle="Reset link sent" />

          <AuthCard>
            <div className="text-center">
              <div className="w-11 h-11 rounded-full bg-[#6e05ff]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#6e05ff]" />
              </div>
              <p className="text-[13px] text-black/55 leading-relaxed mb-1">We sent a reset link to</p>
              <p className="text-[13px] font-medium text-[#050505] mb-5">{email}</p>
              <p className="text-[11px] text-black/40 mb-5">
                Didn't receive it?{" "}
                <button onClick={() => setSent(false)} className="text-[#6e05ff] hover:underline">Try again</button>
              </p>
              <Link to="/auth-login">
                <Button variant="outline" size="sm" className="df-auth-outline text-[12px] h-8 !h-8 gap-1.5 px-4">
                  <ArrowLeft className="w-3 h-3" /> Back to sign in
                </Button>
              </Link>
            </div>
          </AuthCard>
        </>
      )}

      <AuthCopyright />
    </AuthShell>
  );
}
