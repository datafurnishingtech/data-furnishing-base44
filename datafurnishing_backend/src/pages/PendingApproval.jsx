import React from "react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/lib/supabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Clock, Mail } from "lucide-react";

export default function PendingApproval() {
  const { user, logout } = useSupabaseAuth();
  const emailConfirmed = Boolean(user?.email_confirmed_at);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          {emailConfirmed ? <Clock className="w-7 h-7 text-amber-500" /> : <Mail className="w-7 h-7 text-amber-500" />}
        </div>
        <h1 className="text-xl font-semibold mb-2">
          {emailConfirmed ? "Waiting for administrator approval" : "Confirm your email first"}
        </h1>
        <p className="text-[12px] text-muted-foreground mb-6 leading-relaxed">
          {emailConfirmed
            ? `Your email ${user?.email} is verified. An administrator must approve your account before you can access the dashboard.`
            : `We sent a link to ${user?.email}. Open it and confirm your email first.`}
        </p>
        <div className="bg-muted/50 rounded-lg p-3 text-[11px] text-muted-foreground text-left mb-6">
          If you were told you are an administrator but still see this screen, your account may still be pending in the database.
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/auth-login"><Button variant="outline" className="w-full h-9 text-[12px]">Back to sign in</Button></Link>
          <Button variant="ghost" onClick={() => logout()} className="w-full h-9 text-[12px] text-muted-foreground">Sign out</Button>
        </div>
      </div>
    </div>
  );
}