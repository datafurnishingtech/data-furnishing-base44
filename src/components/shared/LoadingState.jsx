import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState({ rows = 6 }) {
  return (
    <div className="bg-card/95 rounded-xl border border-border/60 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 flex gap-4">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="px-4 py-3 flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-2.5 w-1/5" />
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}