import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Globe,
  Network,
  Bell,
  Eye,
  FileText,
  Settings,
  ChevronUp,
  LogOut,
  User,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/" },
  { label: "Furnishers", icon: Building2, path: "/furnishers" },
  { label: "Tradelines", icon: TrendingUp, path: "/tradelines" },
  { label: "Bureau Coverage", icon: Globe, path: "/bureau-coverage" },
  { label: "Product Graph", icon: Network, path: "/product-graph" },
  { label: "Alerts", icon: Bell, path: "/alerts", badge: 12 },
  { label: "Watchlists", icon: Eye, path: "/watchlists" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Display name and initials — fall back to static values if no auth user
  const displayName = user?.full_name || "Alex Kim";
  const displayRole = user?.role || "Data Analyst";
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[210px] bg-card text-foreground flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center justify-center px-3 h-14">
        <img
          src="https://media.base44.com/images/public/69f90686411a7f6520cfe22a/d566b6464_MainSignature.png"
          alt="Data Furnishing"
          className="h-5 w-auto object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2.5 space-y-px overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                isActive
                  ? "bg-primary/8 text-primary"
                  : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <item.icon className={`w-[14px] h-[14px] flex-shrink-0 ${isActive ? "text-primary" : "opacity-40"}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-medium bg-primary/10 text-primary rounded px-1.5 py-0.5 leading-none">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Account Menu */}
      <div className="p-2.5 relative" ref={menuRef}>
        {/* Dropdown — renders above the trigger */}
        {menuOpen && (
          <div className="absolute bottom-full left-2.5 right-2.5 mb-1.5 bg-popover border border-border/60 rounded-lg shadow-lg overflow-hidden z-50 py-1">
            <div className="px-3 py-2 border-b border-border/40 mb-1">
              <p className="text-[11px] font-medium text-foreground truncate">{displayName}</p>
              <p className="text-[10px] text-muted-foreground/60 truncate">{displayRole}</p>
            </div>
            <button
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <User className="w-3 h-3 opacity-60 flex-shrink-0" />
              Profile
            </button>
            <button
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <SlidersHorizontal className="w-3 h-3 opacity-60 flex-shrink-0" />
              Account settings
            </button>
            <div className="h-px bg-border/40 my-1" />
            <button
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-destructive/80 hover:bg-destructive/6 hover:text-destructive transition-colors"
              onClick={() => { setMenuOpen(false); logout(); }}
            >
              <LogOut className="w-3 h-3 flex-shrink-0" />
              Sign out
            </button>
          </div>
        )}

        {/* Trigger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className={`w-full flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors group ${
            menuOpen ? "bg-muted/50" : "hover:bg-muted/40"
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[9px] font-semibold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[11px] font-medium text-foreground truncate">{displayName}</p>
            <p className="text-[10px] text-foreground/40 truncate">{displayRole}</p>
          </div>
          <ChevronUp className={`w-3 h-3 text-muted-foreground/40 flex-shrink-0 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
    </aside>
  );
}