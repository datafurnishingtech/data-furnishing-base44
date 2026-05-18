import React from "react";
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 mb-5 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
      <div className="min-w-0">
        <h1 className="text-[15px] font-semibold text-foreground tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground/70 mt-0.5 font-normal break-words">{subtitle}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        {children}
        <Button variant="outline" size="sm" className="gap-1.5 text-[11px] h-7 px-2.5 font-normal border-border/60">
          <Calendar className="w-3 h-3" />
          May 2025
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-[11px] h-7 px-2.5 font-normal border-border/60">
          <Download className="w-3 h-3" />
          Export
        </Button>
      </div>
    </div>
  );
}
