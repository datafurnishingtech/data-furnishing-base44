import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/lib/supabaseAuthContext";
import { ShieldX } from "lucide-react";

export default function AccessDenied() {
  const { logout } = useSupabaseAuth();
  const location = useLocation();
  const reason = location.state?.reason || new URLSearchParams(location.search).get("reason");

  const title = reason === "suspended" ? "Account suspended" : "Access denied";
  const body = reason === "suspended"
    ? "Your account has been suspended. Contact an administrator if you believe this is a mistake."
    : "Your registration was not approved for this workspace.";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-7 h-7 text-destructive" />
        </div>
        <h1 className="text-xl font-semibold mb-2">{title}</h1>
        <p className="text-[12px] text-muted-foreground mb-6">{body}</p>
        <div className="flex flex-col gap-2">
          <Button variant="ghost" onClick={() => logout()} className="w-full h-9 text-[12px]">Sign out</Button>
          <Link to="/auth-login"><Button variant="outline" className="w-full h-9 text-[12px]">Back to sign in</Button></Link>
        </div>
      </div>
    </div>
  );
}