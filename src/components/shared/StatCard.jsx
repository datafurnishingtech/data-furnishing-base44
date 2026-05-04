import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ label, value, change, changeLabel, icon: Icon, iconColor }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-3">
        {Icon && (
          <Icon className={`w-4 h-4 ${iconColor || "text-primary"}`} />
        )}
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-destructive" />
          )}
          <span
            className={`text-xs font-medium ${
              isPositive ? "text-emerald-500" : "text-destructive"
            }`}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(change)}%
          </span>
          <span className="text-xs text-muted-foreground">
            {changeLabel || "vs last 30 days"}
          </span>
        </div>
      )}
    </div>
  );
}