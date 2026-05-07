import React from "react";
import { Calendar, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-[15px] font-semibold text-foreground tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground/70 mt-0.5 font-normal">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {children}
        <Button variant="outline" size="sm" className="gap-1.5 text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60 hover:text-foreground">
          <Calendar className="w-3 h-3" />
          May 2025
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60 hover:text-foreground">
          <Download className="w-3 h-3" />
          Export
        </Button>
      </div>
    </div>
  );
}