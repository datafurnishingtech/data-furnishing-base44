import React, { useState, useEffect, useCallback, useRef } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE = 2 * 60 * 1000; // show warning 2 min before timeout
const WARNING_AT = IDLE_TIMEOUT - WARNING_BEFORE;

export default function IdleSessionWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const idleTimer = useRef(null);
  const countdownTimer = useRef(null);

  const resetIdle = useCallback(() => {
    setShowWarning(false);
    setCountdown(120);
    clearTimeout(idleTimer.current);
    clearInterval(countdownTimer.current);

    idleTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(120);
      countdownTimer.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(countdownTimer.current);
            // In a real app: base44.auth.logout()
            window.location.reload();
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }, WARNING_AT);
  }, []);

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    
    if (!showWarning) {
      events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));
      resetIdle();
    }
    
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle));
      clearTimeout(idleTimer.current);
      clearInterval(countdownTimer.current);
    };
  }, [resetIdle, showWarning]);

  if (!showWarning) return null;

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-xl p-6 w-[360px] max-w-[calc(100vw-2rem)]">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4.5 h-4.5 text-warning" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Session expiring soon</h3>
            <p className="text-[12px] text-muted-foreground mt-1">
              You've been inactive. For your security, your session will expire in{" "}
              <span className="font-semibold text-warning">{timeStr}</span>.
            </p>
          </div>
        </div>

        <div className="w-full bg-border rounded-full h-1 mb-5">
          <div
            className="bg-warning h-1 rounded-full transition-all duration-1000"
            style={{ width: `${(countdown / 120) * 100}%` }}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={resetIdle} className="flex-1 h-9 text-[12px]">
            Stay signed in
          </Button>
          <Button
            variant="outline"
            className="h-9 text-[12px] text-muted-foreground"
            onClick={() => window.location.reload()}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}