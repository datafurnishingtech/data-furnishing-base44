import React from "react";
import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import AccountMenu from "./AccountMenu";
import { useMobileNav } from "./MobileNavContext";

export default function TopBar() {
  const { setOpen } = useMobileNav();

  return (
    <header className="h-12 bg-card flex items-center justify-between gap-2 px-3 sm:px-5 sticky top-3 z-40 rounded-lg shadow-sm border border-border/60 min-w-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden p-1.5 -ml-0.5 rounded-md text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground transition-colors flex-shrink-0"
        aria-label="Open navigation menu"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Search */}
      <div className="relative flex-1 min-w-0 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search furnishers, products, trade data..."
          className="pl-8 pr-8 sm:pr-12 h-8 bg-muted/50 border-border text-xs w-full min-w-0"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground bg-background border border-border rounded px-1 py-0.5 hidden sm:inline">
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-4 flex-shrink-0">
        <button className="relative p-1.5 rounded-md text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-destructive rounded-full" />
        </button>
        <button className="p-1.5 rounded-md text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>
        <AccountMenu />
      </div>
    </header>
  );
}
