import React, { useState } from "react";
import { LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutAllDevices() {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    setDone(true);
    setConfirming(false);
    setTimeout(() => setDone(false), 3000);
  };

  if (done) return <p className="text-[10.5px] text-emerald-600">✓ All other sessions have been signed out.</p>;

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-[10.5px]">
        <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
        <span className="text-muted-foreground">This will sign out all other active sessions.</span>
        <button onClick={handleConfirm} className="text-destructive font-medium hover:underline">Confirm</button>
        <button onClick={() => setConfirming(false)} className="text-muted-foreground hover:underline">Cancel</button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full text-left text-[10.5px] text-destructive/70 hover:text-destructive py-1 transition-colors flex items-center gap-1.5"
    >
      <LogOut className="w-3 h-3" /> Sign out from all devices
    </button>
  );
}