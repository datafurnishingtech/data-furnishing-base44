import React from "react";
import { Search, Bell, Menu, LogOut, User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/lib/supabaseAuthContext";
import { isAdminProfile } from "@/lib/accessHelpers";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopBar({ onOpenSidebar }) {
  const navigate = useNavigate();
  const { user, profile, logout } = useSupabaseAuth();
  const name = [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(" ")
    || profile?.full_name || user?.email || "User";
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const showAdmin = isAdminProfile(profile, user);

  const handleSearch = (event) => {
    if (event.key === "Enter" && event.currentTarget.value.trim()) {
      navigate(`/furnishers?search=${encodeURIComponent(event.currentTarget.value.trim())}`);
    }
  };

  return (
    <header className="h-12 bg-card rounded-lg shadow-sm border border-border/60 flex items-center gap-3 px-5 shrink-0 sticky top-3 z-40 mx-3">
      <button
        onClick={onOpenSidebar}
        className="lg:hidden text-muted-foreground/70 hover:text-foreground transition-colors"
      >
        <Menu className="w-4 h-4" />
      </button>

      <div className="relative max-w-sm w-full">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Search furnishers, products…"
          className="w-full h-8 pl-8 pr-3 text-xs bg-muted/50 border border-border rounded-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          onKeyDown={handleSearch}
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] bg-background border border-border rounded px-1 py-0.5 text-muted-foreground/50 hidden sm:inline">⌘K</span>
      </div>

      <div className="flex-1" />

      <button className="relative p-1.5 rounded-md text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground transition-colors">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-destructive rounded-full" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-semibold text-white hover:bg-primary/90 transition-colors">
            {initials}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover border border-border/60 rounded-lg shadow-lg py-1">
          <DropdownMenuLabel className="px-3 py-1.5 text-[11px] text-foreground/70">{name}</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem onClick={() => navigate("/settings")} className="px-3 py-1.5 text-[11px] text-foreground/70 hover:bg-muted/50 hover:text-foreground cursor-pointer">
            <User className="w-3.5 h-3.5 mr-2" /> Profile & Settings
          </DropdownMenuItem>
          {showAdmin && (
            <DropdownMenuItem onClick={() => navigate("/admin")} className="px-3 py-1.5 text-[11px] text-foreground/70 hover:bg-muted/50 hover:text-foreground cursor-pointer">
              <Shield className="w-3.5 h-3.5 mr-2" /> Admin Dashboard
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem onClick={() => logout()} className="px-3 py-1.5 text-[11px] text-destructive/80 hover:bg-destructive/10 hover:text-destructive cursor-pointer">
            <LogOut className="w-3.5 h-3.5 mr-2" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}