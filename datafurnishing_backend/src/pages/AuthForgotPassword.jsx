import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseAuth } from "@/lib/supabaseAuthContext";

const BrandLogo = () => (
  <div className="flex items-center gap-2 mb-8">
    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
      <span className="text-white text-[11px] font-bold">DFI</span>
    </div>
    <span className="text-base font-semibold text-foreground">Data Furnishing</span>
  </div>
);

export default function AuthForgotPassword() {
  const { resetPassword } = useSupabaseAuth();
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
    } catch (error) {
      setError(error.message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <BrandLogo />
        {!sent ? (
          <>
            <h1 className="text-xl font-semibold mb-1">Reset your password</h1>
            <p className="text-[12px] text-muted-foreground mb-6">We'll send a reset link to your email</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-foreground/80 block mb-1">Email address</label>
                <Input value={email} type="email" autoFocus placeholder="you@example.com"
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  className={`h-10 text-[13px] ${error ? "border-destructive" : ""}`} />
                {error && <p className="text-[10px] text-destructive mt-1">{error}</p>}
              </div>
              <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send reset link <ArrowRight className="w-4 h-4 ml-1" /></>}
              </Button>
            </form>
            <Link to="/auth-login" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mt-4">
              <ArrowLeft className="w-3 h-3" /> Back to sign in
            </Link>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
            <h1 className="text-xl font-semibold mb-1">Check your inbox</h1>
            <p className="text-[12px] text-muted-foreground mb-4">We sent a reset link to <strong>{email}</strong></p>
            <p className="text-[11px] text-muted-foreground">
              Didn't receive it?{" "}
              <button onClick={() => setSent(false)} className="text-primary hover:underline">Try again</button>
            </p>
            <Link to="/auth-login" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mt-4">
              <ArrowLeft className="w-3 h-3" /> Back to sign in
            </Link>
          </>
        )}
        <p className="text-center text-[10px] text-muted-foreground/40 mt-8">© 2026 Data Furnishing Technologies, Inc.</p>
      </div>
    </div>
  );
}