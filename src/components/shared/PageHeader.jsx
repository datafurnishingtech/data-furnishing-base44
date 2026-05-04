import React from "react";
import { Calendar, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          May 1 – May 31, 2025
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5" />
          Export
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}