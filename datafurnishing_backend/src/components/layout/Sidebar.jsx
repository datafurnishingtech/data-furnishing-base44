import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, TrendingUp, Globe, Network,
  Bell, Eye, FileText, Settings, Shield, LogOut,
} from "lucide-react";
import { useSupabaseAuth } from "@/lib/supabaseAuthContext";
import { isAdminProfile } from "@/lib/accessHelpers";

const baseNavItems = [
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

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const { user, logout, profile } = useSupabaseAuth();
  const name = [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(" ") || user?.email || "User";
  const roleLabel = profile?.role || user?.user_metadata?.role || user?.user_metadata?.company || "Signed in";
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const navItems = isAdminProfile(profile, user)
    ? [...baseNavItems, { label: "Admin", icon: Shield, path: "/admin" }]
    : baseNavItems;

  return (
    <aside className="flex flex-col h-full w-[210px] bg-card border-r border-border/70 select-none">
      {/* Logo */}
      <div className="flex items-center justify-center px-3 h-14 border-b border-border/60">
        <img
          src="https://media.base44.com/images/public/69f90686411a7f6520cfe22a/d566b6464_MainSignature.png"
          alt="Data Furnishing"
          className="h-5 w-auto object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-px">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                active
                  ? "bg-primary/8 text-primary"
                  : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon className={`w-3 h-3 shrink-0 ${active ? "" : "opacity-60"}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] bg-primary/10 text-primary rounded px-1.5 py-0.5 font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-2.5 border-t border-border/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[9px] font-semibold text-white shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-foreground truncate">{name}</div>
            <div className="text-[10px] text-foreground/40 truncate capitalize">{roleLabel}</div>
          </div>
          <button
            onClick={() => logout()}
            className="text-muted-foreground/40 hover:text-foreground transition-colors p-1 rounded"
            title="Sign out"
          >
            <LogOut className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}