import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ label, value, change, changeLabel, icon: Icon, iconColor }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-card rounded-xl border border-border px-4 py-3.5">
      <div className="flex items-center gap-1.5 mb-2">
        {Icon && (
          <Icon className={`w-3.5 h-3.5 ${iconColor || "text-primary"}`} />
        )}
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-xl font-bold text-foreground leading-none">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-1.5">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-destructive" />
          )}
          <span
            className={`text-[10px] font-medium ${
              isPositive ? "text-emerald-500" : "text-destructive"
            }`}
          >
            {isPositive ? "+" : ""}{Math.abs(change)}%
          </span>
          <span className="text-[10px] text-muted-foreground">
            {changeLabel || "vs 30d"}
          </span>
        </div>
      )}
    </div>
  );
}