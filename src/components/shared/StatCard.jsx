import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import CountUp from "react-countup";

// Parse a display string like "2,847", "24.6M", "98.1%", "1,842" into { num, prefix, suffix }
const parseValue = (value) => {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/^([^0-9]*)([0-9]+\.?[0-9]*)([^0-9]*)$/);
  if (!match) return null;
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
};

export default function StatCard({ label, value, change, changeLabel, icon: Icon, iconColor, scaled = false }) {
  const isPositive = change >= 0;
  const parsed = parseValue(value);

  return (
    <div className="bg-card rounded-lg border border-border/60 px-4 py-3.5 flex flex-col gap-2 min-w-0">
      <span className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground/70 truncate whitespace-nowrap">
        {label}
      </span>
      <p className="text-[14px] font-medium text-foreground leading-none tracking-tight truncate">
        {parsed ? (
          <CountUp
            start={0}
            end={parsed.num}
            duration={1.2}
            delay={0}
            prefix={parsed.prefix}
            suffix={parsed.suffix}
            decimals={(parsed.num % 1 !== 0) ? 1 : 0}
            separator=","
            useEasing
          />
        ) : value}
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