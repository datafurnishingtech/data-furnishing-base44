import React, { useState, useRef, useCallback, useEffect } from "react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronDown } from "lucide-react";

const AUTHORIZED_PRIMARY_AGENCIES = new Set([
  "Experian",
  "Equifax",
  "TransUnion",
  "SBFE",
  "Experian Business",
  "Equifax Business",
]);

const bureaus = [
  { name: "Experian", domain: "experian.com", type: "Consumer", coverage: 98.7, change: 2.6 },
  { name: "Equifax", domain: "equifax.com", type: "Consumer", coverage: 97.9, change: 2.1 },
  { name: "TransUnion", domain: "transunion.com", type: "Consumer", coverage: 98.3, change: 2.4 },
  { name: "SBFE", domain: "sbfe.org", type: "Business", coverage: 88.4, change: 1.6 },
  { name: "Experian Business", domain: "experian.com", type: "Business", coverage: 84.1, change: 1.3 },
  { name: "Equifax Business", domain: "equifax.com", type: "Business", coverage: 81.7, change: 0.9 },
];

const authorizedPrimaryBureaus = bureaus.filter((bureau) =>
  AUTHORIZED_PRIMARY_AGENCIES.has(bureau.name) && ["Consumer", "Business"].includes(bureau.type)
);

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

  const sorted = sortBureaus(authorizedPrimaryBureaus, sortKey, sortDir);

  const SortBtn = ({ k, label }) => (
    <button
      onClick={() => handleSort(k)}
      className={`flex items-center gap-0.5 group transition-colors ${sortKey === k ? "text-foreground/80" : "text-muted-foreground/50 hover:text-muted-foreground/80"}`}
    >
      <span>{label}</span>
      {sortKey === k
        ? sortDir === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
        : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-60" />}
    </button>
  );

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="overflow-y-auto rounded-lg border border-border/60 bg-card"
        style={{ maxHeight: 248 }}
        onScroll={checkScroll}
      >
        <table className="w-full min-w-[520px] border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
            <tr className="border-b border-border/60 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
              <th className="text-left px-4 py-3 font-semibold">
                <SortBtn k="name" label="Agency" />
              </th>
              <th className="text-left px-3 py-3 font-semibold">Type</th>
              <th className="text-right px-3 py-3 font-semibold">
                <div className="flex justify-end"><SortBtn k="coverage" label="Coverage" /></div>
              </th>
              <th className="text-right px-4 py-3 font-semibold">
                <div className="flex justify-end"><SortBtn k="change" label="30d Δ" /></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((b) => (
              <tr key={b.name + b.type} className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <FurnisherLogo domain={b.domain} name={b.name} size="sm" />
                    <div>
                      <span className="block text-[11.5px] font-medium leading-tight text-foreground">{b.name}</span>
                      <span className="block text-[9.5px] leading-tight text-muted-foreground/55">Authorized primary agency</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ${
                    b.type === "Consumer" ? "bg-primary/10 text-primary" :
                    b.type === "Business" ? "bg-accent/10 text-accent" :
                    "bg-muted text-muted-foreground"
                  }`}>{b.type}</span>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[12px] font-semibold text-foreground tabular-nums leading-none">{b.coverage}%</span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: `${b.coverage}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`text-[11px] tabular-nums font-semibold ${b.change > 0 ? "text-success" : b.change < 0 ? "text-destructive" : "text-muted-foreground/50"}`}>
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
          <div className="h-8 bg-gradient-to-t from-card via-card/80 to-transparent" />
          <div className="flex justify-center -mt-2">
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40 animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
}