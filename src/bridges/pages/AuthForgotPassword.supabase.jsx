import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BrandLogo = () => (
  <img src="https://media.base44.com/images/public/69f90686411a7f6520cfe22a/4859ca4a2_MainSignature.png" alt="Data Furnishing" className="h-6 w-auto" />
);

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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <div className="flex justify-center mb-10">
          <BrandLogo />
        </div>

        {!sent ? (
          <>
            <div className="mb-7 text-center">
              <h1 className="text-[19px] font-semibold text-foreground tracking-tight">Reset your password</h1>
              <p className="text-[12.5px] text-muted-foreground mt-1.5">We'll send a reset link to your email</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-7 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email address</label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (error) setError(""); }}
                    className={`h-10 text-[13px] ${error ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                    autoComplete="email"
                  />
                  {error && <p className="text-[11px] text-destructive mt-1">{error}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full h-10 text-[13px] font-medium gap-2">
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
            <div className="mb-7 text-center">
              <h1 className="text-[19px] font-semibold text-foreground tracking-tight">Check your inbox</h1>
              <p className="text-[12.5px] text-muted-foreground mt-1.5">Reset link sent</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-7 shadow-sm text-center">
              <div className="w-11 h-11 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-1">We sent a reset link to</p>
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

        <p className="text-center text-[10px] text-muted-foreground/40 mt-8">© 2026 Data Furnishing Technologies, Inc.</p>
      </div>
    </div>
  );
}