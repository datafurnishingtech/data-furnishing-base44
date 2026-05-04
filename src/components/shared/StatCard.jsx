import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ label, value, change, changeLabel, icon: Icon, iconColor }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-card rounded-lg border border-border/60 px-4 py-3.5 flex flex-col gap-2 min-w-0">
      <span className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground/70 truncate whitespace-nowrap">
        {label}
      </span>
      <p className="text-[22px] font-semibold text-foreground leading-none tracking-tight truncate">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1 flex-wrap">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
          ) : (
            <TrendingDown className="w-3 h-3 text-destructive flex-shrink-0" />
          )}
          <span className={`text-[10px] font-medium whitespace-nowrap ${isPositive ? "text-emerald-500" : "text-destructive"}`}>
            {isPositive ? "+" : ""}{Math.abs(change)}%
          </span>
          <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">
            {changeLabel || "vs 30d"}
          </span>
        </div>
      )}
    </div>
  );
}