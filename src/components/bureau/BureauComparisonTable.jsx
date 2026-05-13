import React, { useState, useRef, useCallback, useEffect } from "react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronDown } from "lucide-react";

const bureaus = [
  { name: "Experian", domain: "experian.com", type: "Consumer", coverage: 98.7, change: 2.6 },
  { name: "Equifax", domain: "equifax.com", type: "Consumer", coverage: 97.9, change: 2.1 },
  { name: "TransUnion", domain: "transunion.com", type: "Consumer", coverage: 98.3, change: 2.4 },
  { name: "Innovis", domain: "innovis.com", type: "Consumer", coverage: 93.6, change: 1.8 },
  { name: "SBFE", domain: "sbfe.org", type: "Business", coverage: 88.4, change: 1.6 },
  { name: "Experian Business", domain: "experian.com", type: "Business", coverage: 84.1, change: 1.3 },
  { name: "Equifax Business", domain: "equifax.com", type: "Business", coverage: 81.7, change: 0.9 },
  { name: "CreditSafe", domain: "creditsafe.com", type: "Business", coverage: 76.3, change: 1.1 },
  { name: "ChexSystems", domain: "chexsystems.com", type: "Specialty", coverage: 71.2, change: 0.6 },
  { name: "LexisNexis Risk", domain: "lexisnexis.com", type: "Specialty", coverage: 68.9, change: 0.4 },
  { name: "MicroBilt", domain: "microbilt.com", type: "Specialty", coverage: 62.4, change: -0.2 },
];

function sortBureaus(data, key, dir) {
  return [...data].sort((a, b) => {
    const va = a[key], vb = b[key];
    if (typeof va === "string") return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return dir === "asc" ? va - vb : vb - va;
  });
}

export default function BureauComparisonTable() {
  const [sortKey, setSortKey] = useState("coverage");
  const [sortDir, setSortDir] = useState("desc");
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollRef = useRef(null);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    checkScroll();
  }, [sortKey, sortDir, checkScroll]);

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
    <div className="relative">
      <div
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ maxHeight: 248 }}
        onScroll={checkScroll}
      >
        <table className="w-full">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="text-[9.5px] font-medium uppercase tracking-[0.06em] border-b border-border/50">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground/60">
                <SortBtn k="name" label="Bureau" />
              </th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground/60">Type</th>
              <th className="text-right px-3 py-2.5 font-medium text-muted-foreground/60">
                <div className="flex justify-end"><SortBtn k="coverage" label="Coverage" /></div>
              </th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground/60">
                <div className="flex justify-end"><SortBtn k="change" label="30d Δ" /></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((b) => (
              <tr key={b.name + b.type} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <FurnisherLogo domain={b.domain} name={b.name} size="sm" />
                    <span className="text-[11px] text-foreground">{b.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                    b.type === "Consumer" ? "bg-primary/8 text-primary/80" :
                    b.type === "Business" ? "bg-amber-500/10 text-amber-600" :
                    "bg-muted text-muted-foreground/70"
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
                <td className="px-4 py-2.5 text-right">
                  <span className={`text-[11px] tabular-nums font-medium ${b.change > 0 ? "text-emerald-500" : b.change < 0 ? "text-destructive" : "text-muted-foreground/50"}`}>
                    {b.change > 0 ? "+" : ""}{b.change}pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scroll indicator */}
      {canScrollDown && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="h-8 bg-gradient-to-t from-card to-transparent" />
          <div className="flex justify-center -mt-2">
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40 animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
}