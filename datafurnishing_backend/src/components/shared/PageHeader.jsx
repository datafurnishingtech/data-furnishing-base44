import React from "react";
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-[15px] font-semibold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-muted-foreground/70 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5 border-border/60 text-muted-foreground font-normal hover:bg-muted/50 hover:text-foreground">
          <Calendar className="w-3 h-3" /> May 2025
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5 border-border/60 text-muted-foreground font-normal hover:bg-muted/50 hover:text-foreground">
          <Download className="w-3 h-3" /> Export
        </Button>
      </div>
    </div>
  );
}