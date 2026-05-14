import React from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your filters or search terms.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="bg-card/95 rounded-xl border border-border/60 shadow-sm p-10 text-center flex flex-col items-center justify-center min-h-[220px]">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
        <SearchX className="w-4 h-4 text-muted-foreground/70" />
      </div>
      <h3 className="text-[13px] font-medium text-foreground">{title}</h3>
      <p className="text-[11px] text-muted-foreground/70 mt-1 max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" className="mt-4 h-7 text-[11px]" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}