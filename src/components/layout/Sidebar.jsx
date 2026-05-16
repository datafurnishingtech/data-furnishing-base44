import React from "react";
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
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  // Display name and initials — fall back to static values if no auth user
  const displayName = user?.full_name || "Alex Kim";
  const displayRole = user?.role || "Data Analyst";
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();


  return (
    <aside className="fixed left-0 top-0 h-screen w-[210px] bg-card text-foreground flex flex-col z-50 border-r border-border/70">
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
              <item.icon className={`w-3 h-3 flex-shrink-0 ${isActive ? "" : "opacity-60"}`} />
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

      {/* User Identity */}
      <div className="p-2.5 relative">
        <div className="w-full flex items-center gap-2 rounded-md px-1.5 py-1">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[9px] font-semibold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[11px] font-medium text-foreground truncate">{displayName}</p>
            <p className="text-[10px] text-foreground/40 truncate">{displayRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}