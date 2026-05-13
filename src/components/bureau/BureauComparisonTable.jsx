import React, { useState } from "react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

const bureaus = [
  { name: "Experian", domain: "experian.com", type: "Consumer", coverage: 98.7, change: 2.6, confidence: "High", status: "Active" },
  { name: "Equifax", domain: "equifax.com", type: "Consumer", coverage: 97.9, change: 2.1, confidence: "High", status: "Active" },
  { name: "TransUnion", domain: "transunion.com", type: "Consumer", coverage: 98.3, change: 2.4, confidence: "High", status: "Active" },
  { name: "Innovis", domain: "innovis.com", type: "Consumer", coverage: 93.6, change: 1.8, confidence: "High", status: "Active" },
  { name: "SBFE", domain: "sbfe.org", type: "Business", coverage: 88.4, change: 1.6, confidence: "Medium", status: "Active" },
  { name: "Experian Business", domain: "experian.com", type: "Business", coverage: 84.1, change: 1.3, confidence: "Medium", status: "Active" },
  { name: "Equifax Business", domain: "equifax.com", type: "Business", coverage: 81.7, change: 0.9, confidence: "Medium", status: "Active" },
  { name: "CreditSafe", domain: "creditsafe.com", type: "Business", coverage: 76.3, change: 1.1, confidence: "Medium", status: "Active" },
  { name: "ChexSystems", domain: "chexsystems.com", type: "Specialty", coverage: 71.2, change: 0.6, confidence: "Low", status: "Partial" },
  { name: "LexisNexis Risk", domain: "lexisnexis.com", type: "Specialty", coverage: 68.9, change: 0.4, confidence: "Low", status: "Partial" },
  { name: "MicroBilt", domain: "microbilt.com", type: "Specialty", coverage: 62.4, change: -0.2, confidence: "Low", status: "Partial" },
];

const SORT_OPTIONS = [
  { key: "coverage", label: "Coverage" },
  { key: "change", label: "Delta" },
  { key: "confidence", label: "Confidence" },
  { key: "name", label: "Name" },
];

const confidenceOrder = { High: 0, Medium: 1, Low: 2 };

function sortBureaus(data, key, dir) {
  return [...data].sort((a, b) => {
    let va = a[key], vb = b[key];
    if (key === "confidence") { va = confidenceOrder[va] ?? 3; vb = confidenceOrder[vb] ?? 3; }
    if (typeof va === "string") return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return dir === "asc" ? va - vb : vb - va;
  });
}

export default function BureauComparisonTable() {
  const [sortKey, setSortKey] = useState("coverage");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = sortBureaus(bureaus, sortKey, sortDir);

  const SortBtn = ({ k, label }) => (
    <button
      onClick={() => handleSort(k)}
      className={`flex items-center gap-0.5 group transition-colors ${sortKey === k ? "text-foreground/80" : "text-muted-foreground/50 hover:text-muted-foreground/80"}`}
    >
      {label}
      {sortKey === k
        ? sortDir === "desc" ? <ArrowDown className="w-2.5 h-2.5" /> : <ArrowUp className="w-2.5 h-2.5" />
        : <ArrowUpDown className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60" />}
    </button>
  );

  return (
    <table className="w-full">
      <thead>
        <tr className="text-[9.5px] font-medium uppercase tracking-[0.06em] border-b border-border/50">
          <th className="text-left px-4 py-2.5 font-medium text-muted-foreground/60">
            <SortBtn k="name" label="Bureau" />
          </th>
          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground/60">Type</th>
          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground/60">
            <div className="flex justify-end"><SortBtn k="coverage" label="Coverage" /></div>
          </th>
          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground/60">
            <div className="flex justify-end"><SortBtn k="change" label="30d Δ" /></div>
          </th>
          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground/60">
            <SortBtn k="confidence" label="Confidence" />
          </th>
          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground/60">Status</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((b) => (
          <tr key={b.name + b.type} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors group">
            <td className="px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <FurnisherLogo domain={b.domain} name={b.name} size="sm" />
                <div>
                  <span className="text-[11px] text-foreground">{b.name}</span>
                </div>
              </div>
            </td>
            <td className="px-3 py-2.5">
              <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                b.type === "Consumer" ? "bg-primary/8 text-primary/80" :
                b.type === "Business" ? "bg-amber-500/10 text-amber-600" :
                "bg-muted text-muted-foreground"
              }`}>{b.type}</span>
            </td>
            <td className="px-3 py-2.5 text-right">
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[12px] font-medium text-foreground tabular-nums leading-none">{b.coverage}%</span>
                <div className="w-16 h-1 bg-muted/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary/50" style={{ width: `${b.coverage}%` }} />
                </div>
              </div>
            </td>
            <td className="px-3 py-2.5 text-right">
              <span className={`text-[11px] tabular-nums font-medium ${b.change > 0 ? "text-emerald-500" : b.change < 0 ? "text-destructive" : "text-muted-foreground/50"}`}>
                {b.change > 0 ? "+" : ""}{b.change}pts
              </span>
            </td>
            <td className="px-3 py-2.5">
              <span className={`text-[10px] font-medium ${
                b.confidence === "High" ? "text-emerald-500" :
                b.confidence === "Medium" ? "text-amber-500" :
                "text-destructive/70"
              }`}>{b.confidence}</span>
            </td>
            <td className="px-3 py-2.5">
              <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                b.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground/60"
              }`}>{b.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}