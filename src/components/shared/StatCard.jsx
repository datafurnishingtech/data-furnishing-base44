import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const formatScaledNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export default function StatCard({ label, value, change, changeLabel, icon: Icon, iconColor, scaled = false }) {
  const isPositive = change >= 0;
  const displayValue = scaled && typeof value === 'number' ? formatScaledNumber(value) : value;
  
  return (
    <div className="bg-card rounded-lg border border-border/60 px-4 py-3.5 flex flex-col gap-2 min-w-0">
      <span className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground/70 truncate whitespace-nowrap">
        {label}
      </span>
      <p className="text-[22px] font-semibold text-foreground leading-none tracking-tight truncate" title={scaled && typeof value === 'number' ? value.toLocaleString() : undefined}>
        {displayValue}
      </p>
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