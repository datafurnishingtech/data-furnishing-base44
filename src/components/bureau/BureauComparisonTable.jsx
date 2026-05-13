import React, { useState } from "react";
import { ArrowUp, ArrowDown, ArrowRight, ArrowUpDown, ExternalLink } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";

const bureauData = [
  { name: "Experian", domain: "experian.com", type: "Consumer", coverage: 98.7, delta: 2.6, confidence: "High", rank: 1 },
  { name: "TransUnion", domain: "transunion.com", type: "Consumer", coverage: 98.3, delta: 2.4, confidence: "High", rank: 2 },
  { name: "Equifax", domain: "equifax.com", type: "Consumer", coverage: 97.9, delta: 2.1, confidence: "High", rank: 3 },
  { name: "Innovis", domain: "innovis.com", type: "Consumer", coverage: 93.6, delta: 1.8, confidence: "Medium", rank: 4 },
  { name: "SBFE", domain: "sbfe.org", type: "Business", coverage: 88.4, delta: 1.6, confidence: "Medium", rank: 5 },
  { name: "Experian Business", domain: "experian.com", type: "Business", coverage: 84.1, delta: 1.3, confidence: "Medium", rank: 6 },
];

const SORT_OPTIONS = [
  { key: "coverage", label: "Coverage" },
  { key: "delta", label: "Delta" },
  { key: "confidence", label: "Confidence" },
  { key: "name", label: "Name" },
];

const confidenceOrder = { High: 0, Medium: 1, Low: 2 };

export default function BureauComparisonTable() {
  const [sortKey, setSortKey] = useState("coverage");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...bureauData].sort((a, b) => {
    let av = a[sortKey];
    let bv = b[sortKey];
    if (sortKey === "confidence") {
      av = confidenceOrder[av] ?? 99;
      bv = confidenceOrder[bv] ?? 99;
    } else if (sortKey === "name") {
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const SortBtn = ({ col }) => (
    <button
      onClick={() => handleSort(col)}
      className="flex items-center gap-0.5 group"
    >
      <span>{SORT_OPTIONS.find((o) => o.key === col)?.label}</span>
      <ArrowUpDown
        className={`w-2.5 h-2.5 transition-opacity ${
          sortKey === col ? "opacity-70 text-primary" : "opacity-0 group-hover:opacity-40"
        }`}
      />
    </button>
  );

  return (
    <table className="w-full">
      <thead>
        <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
          <th className="text-left pb-2.5 font-medium pr-3">
            <SortBtn col="name" />
          </th>
          <th className="text-left pb-2.5 font-medium px-3">Type</th>
          <th className="text-right pb-2.5 font-medium px-3">
            <SortBtn col="coverage" />
          </th>
          <th className="text-right pb-2.5 font-medium px-3">
            <SortBtn col="delta" />
          </th>
          <th className="text-right pb-2.5 font-medium px-3">
            <SortBtn col="confidence" />
          </th>
          <th className="text-right pb-2.5 font-medium pl-3"></th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((b) => {
          const isTop = b.coverage >= 97;
          return (
            <tr
              key={b.name}
              className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors group"
            >
              {/* Bureau identity */}
              <td className="py-2 pr-3">
                <div className="flex items-center gap-2">
                  <FurnisherLogo domain={b.domain} name={b.name} size="sm" />
                  <div>
                    <p className="text-[11px] text-foreground leading-snug">{b.name}</p>
                    {isTop && (
                      <span className="text-[9px] font-medium text-primary/70 leading-none">#1 ranked</span>
                    )}
                  </div>
                </div>
              </td>

              {/* Type */}
              <td className="py-2 px-3">
                <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                  b.type === "Consumer"
                    ? "bg-primary/8 text-primary/70"
                    : "bg-muted text-muted-foreground/70"
                }`}>
                  {b.type}
                </span>
              </td>

              {/* Coverage */}
              <td className="py-2 px-3 text-right">
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[12px] font-medium text-foreground tabular-nums leading-none">
                    {b.coverage}%
                  </span>
                  <div className="w-14 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/60"
                      style={{ width: `${b.coverage}%` }}
                    />
                  </div>
                </div>
              </td>

              {/* Delta */}
              <td className="py-2 px-3 text-right">
                <span className={`inline-flex items-center gap-0.5 text-[10.5px] font-medium tabular-nums ${
                  b.delta > 0 ? "text-emerald-500" : b.delta < 0 ? "text-destructive" : "text-muted-foreground/50"
                }`}>
                  {b.delta > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : b.delta < 0 ? <ArrowDown className="w-2.5 h-2.5" /> : null}
                  {b.delta > 0 ? "+" : ""}{b.delta}pts
                </span>
              </td>

              {/* Confidence */}
              <td className="py-2 px-3 text-right">
                <span className={`text-[10px] font-medium ${
                  b.confidence === "High"
                    ? "text-emerald-500"
                    : b.confidence === "Medium"
                    ? "text-amber-500"
                    : "text-destructive"
                }`}>
                  {b.confidence}
                </span>
              </td>

              {/* Action */}
              <td className="py-2 pl-3 text-right">
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[9.5px] text-primary/70 hover:text-primary flex items-center gap-0.5 ml-auto whitespace-nowrap">
                  Details <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}