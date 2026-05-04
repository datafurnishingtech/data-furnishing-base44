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
  ChevronLeft,
  ChevronRight,
  Search,
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

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col z-50 transition-all duration-300 ${
        collapsed ? "w-[64px]" : "w-[210px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center px-3 h-14 border-b border-sidebar-border">
        {collapsed ? (
          <img
            src="https://media.base44.com/images/public/69f90686411a7f6520cfe22a/eba179282_MainSignature-Negative-02.png"
            alt="Data Furnishing"
            className="w-7 h-7 object-contain"
          />
        ) : (
          <img
            src="https://media.base44.com/images/public/69f90686411a7f6520cfe22a/eba179282_MainSignature-Negative-02.png"
            alt="Data Furnishing"
            className="h-6 w-auto object-contain"
          />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12px] font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
              }`}
            >
              <item.icon className="w-[15px] h-[15px] flex-shrink-0" />
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <Badge className="bg-primary/30 text-white border-0 text-[9px] px-1 py-0 h-4 min-w-[16px] flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[9px] font-semibold text-white flex-shrink-0">
            AK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-white truncate">Alex Kim</p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">Data Analyst</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="border-t border-sidebar-border px-2.5 py-2 flex items-center gap-2 text-[11px] text-sidebar-foreground/50 hover:text-white transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 mx-auto" />
        ) : (
          <>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Collapse</span>
          </>
        )}
      </button>
    </aside>
  );
}