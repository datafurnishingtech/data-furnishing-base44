import React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function SortableHeader({ label, sortKey, activeKey, direction, onSort, align = "left", className = "" }) {
  const isActive = activeKey === sortKey;
  const Icon = !isActive ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`group inline-flex items-center gap-1.5 py-2.5 font-semibold uppercase tracking-[0.08em] transition-colors hover:text-foreground ${
          align === "right" ? "justify-end w-full" : "justify-start"
        } ${isActive ? "text-foreground" : "text-muted-foreground/65"}`}
      >
        <span>{label}</span>
        <Icon className={`w-3 h-3 transition-opacity ${isActive ? "opacity-80" : "opacity-35 group-hover:opacity-70"}`} />
      </button>
    </th>
  );
}