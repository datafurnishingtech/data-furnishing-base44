import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const formatScaledNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export default function StatCard({ label, value, change, changeLabel, scaled = false }) {
  const isPositive = change >= 0;
  const displayValue = scaled && typeof value === "number" ? formatScaledNumber(value) : value;

  return (
    <div className="bg-card rounded-lg border border-border/60 px-4 py-3.5">
      <div className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground/70 mb-1.5">{label}</div>
      <div className="text-[14px] font-medium text-foreground leading-none tracking-tight">{displayValue}</div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-1.5">
          {isPositive ? (
            <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-2.5 h-2.5 text-destructive" />
          )}
          <span className={`text-[10px] font-medium ${isPositive ? "text-emerald-500" : "text-destructive"}`}>
            {isPositive ? "+" : ""}{Math.abs(change)}%
          </span>
          <span className="text-[10px] text-muted-foreground/50">{changeLabel || "vs 30d"}</span>
        </div>
      )}
    </div>
  );
}