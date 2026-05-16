import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, SlidersHorizontal, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AccountMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.full_name || "Alex Kim";
  const displayRole = user?.role || "Data Analyst";
  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex items-center rounded-full p-0.5 transition-colors ${
          open ? "bg-muted" : "hover:bg-muted/70"
        }`}
        aria-label="Open account menu"
        aria-expanded={open}
      >
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-semibold text-primary-foreground ring-1 ring-primary/10">
          {initials}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-[0_8px_24px_rgba(25,25,25,0.08)] overflow-hidden z-50 py-1">
          <div className="px-3 py-2 border-b border-border/40 mb-1">
            <p className="text-[11px] font-medium text-foreground truncate">{displayName}</p>
            <p className="text-[10px] text-muted-foreground/60 truncate">{displayRole}</p>
          </div>
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left"
            onClick={() => setOpen(false)}
          >
            <User className="w-3 h-3 opacity-60 flex-shrink-0" />
            Profile
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left"
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
          >
            <SlidersHorizontal className="w-3 h-3 opacity-60 flex-shrink-0" />
            Account Settings
          </button>
          <div className="h-px bg-border/40 my-1" />
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
            onClick={() => {
              setOpen(false);
              logout();
            }}
          >
            <LogOut className="w-3 h-3 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}