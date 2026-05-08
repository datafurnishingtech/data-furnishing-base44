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
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  return (
    <aside className="fixed left-0 top-0 h-screen w-[210px] bg-card text-foreground flex flex-col z-50 border-r border-border">
      {/* Logo */}
      <div className="flex items-center px-3 h-14 border-b border-border">
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
              className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[11px] font-normal tracking-normal transition-colors ${
                isActive
                  ? "bg-primary/8 text-primary font-medium"
                  : "text-foreground/40 hover:bg-muted hover:text-foreground/70"
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

      {/* User */}
      <div className="border-t border-border p-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[9px] font-semibold text-white flex-shrink-0">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-foreground truncate">Alex Kim</p>
            <p className="text-[10px] text-foreground/40 truncate">Data Analyst</p>
          </div>
        </div>
      </div>
    </aside>
  );
}