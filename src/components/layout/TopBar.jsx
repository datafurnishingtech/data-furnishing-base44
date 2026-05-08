import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TopBar() {
  return (
    <header className="h-12 flex items-center justify-between px-5 sticky top-0 z-40 bg-card">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search furnishers, products, trade data..."
          className="pl-8 pr-12 h-8 bg-muted/50 border-border text-xs"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground bg-background border border-border rounded px-1 py-0.5">
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-4">
        <button className="relative p-1.5 rounded-md hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-destructive rounded-full" />
        </button>
        <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-semibold text-primary-foreground">
          AK
        </div>
      </div>
    </header>
  );
}