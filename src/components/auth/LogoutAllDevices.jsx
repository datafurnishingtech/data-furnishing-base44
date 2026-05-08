import React, { useState } from "react";
import { LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutAllDevices() {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    setDone(true);
    setConfirming(false);
    // In a real app: invalidate all sessions server-side then redirect
    setTimeout(() => setDone(false), 3000);
  };

  if (done) {
    return (
      <p className="text-[10.5px] text-success py-1">✓ All other sessions have been signed out.</p>
    );
  }

  if (confirming) {
    return (
      <div className="rounded-md bg-destructive/8 border border-destructive/20 p-2.5 space-y-2">
        <div className="flex items-start gap-1.5">
          <AlertTriangle className="w-3 h-3 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-destructive leading-snug">This will sign out all other active sessions immediately.</p>
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" variant="destructive" className="h-6 text-[10px] px-2.5" onClick={handleConfirm}>Confirm</Button>
          <Button size="sm" variant="outline" className="h-6 text-[10px] px-2.5" onClick={() => setConfirming(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full text-left text-[10.5px] text-destructive/70 hover:text-destructive py-1 transition-colors flex items-center gap-1.5"
    >
      <LogOut className="w-3 h-3" />
      Sign out from all devices
    </button>
  );
}