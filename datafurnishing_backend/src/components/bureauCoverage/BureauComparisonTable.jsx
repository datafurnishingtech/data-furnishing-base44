import React, { useState, useRef } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";

const BUREAUS = [
  { name: "Experian",              abbr: "EX", type: "consumer", coverage: 98.7, signals: 24600000, reporting: 18, domain: "experian.com" },
  { name: "Equifax",               abbr: "EQ", type: "consumer", coverage: 97.9, signals: 23100000, reporting: 16, domain: "equifax.com" },
  { name: "TransUnion",            abbr: "TU", type: "consumer", coverage: 98.3, signals: 23800000, reporting: 17, domain: "transunion.com" },
  { name: "Innovis",               abbr: "IN", type: "consumer", coverage: 72.1, signals: 8400000,  reporting: 9,  domain: "innovis.com" },
  { name: "SBFE",                  abbr: "SB", type: "business", coverage: 61.4, signals: 3200000,  reporting: 6,  domain: "sbfe.org" },
  { name: "Experian Small Business",abbr: "ESB",type: "business", coverage: 58.9, signals: 2900000, reporting: 5,  domain: "experian.com" },
  { name: "Dun & Bradstreet",      abbr: "D&B", type: "business", coverage: 54.2, signals: 2400000, reporting: 4,  domain: "dnb.com" },
];

function typeBadge(type) {
  if (type === "consumer") return "bg-primary/10 text-primary/80";
  if (type === "business") return "bg-amber-500/10 text-amber-600";
  if (type === "specialty") return "bg-muted text-muted-foreground/70";
  return "bg-secondary text-secondary-foreground";
}

export default function BureauComparisonTable({ isLoading }) {
  const [sortKey, setSortKey]   = useState("coverage");
  const [sortDir, setSortDir]   = useState("desc");
  const [canScrollMore, setCanScrollMore] = useState(true);
  const scrollRef = useRef(null);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...BUREAUS].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const handleScroll = (e) => {
    const el = e.currentTarget;
    setCanScrollMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  };

  function SortBtn({ col, label }) {
    const active = sortKey === col;
    const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
    return (
      <button
        onClick={() => handleSort(col)}
        className={`group flex items-center gap-0.5 transition-colors ${active ? "text-foreground/80" : "text-muted-foreground/50 hover:text-muted-foreground/80"}`}
      >
        {label}
        <Icon className={`w-2.5 h-2.5 ${active ? "opacity-80" : "opacity-0 group-hover:opacity-60"} transition-opacity`} />
      </button>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border/60 overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-border/40">
        <div className="text-[11.5px] font-medium text-foreground">Bureau Coverage Comparison</div>
        <div className="text-[10px] text-muted-foreground/60 mt-0.5">
          % of active tradelines covered per bureau — click column header to sort
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto"
          style={{ maxHeight: 248 }}
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border/50">
                <th className="text-left px-4 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap">
                  <SortBtn col="name" label="Bureau" />
                </th>
                <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em]">Type</th>
                <th className="text-right px-4 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em]">
                  <SortBtn col="coverage" label="Coverage" />
                </th>
                <th className="text-right px-4 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em]">
                  <SortBtn col="signals" label="Signals" />
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/30">
                    {[1, 2, 3, 4].map((j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-5 bg-muted/50 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sorted.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-[11px] text-muted-foreground/60 py-8">No active bureaus found.</td></tr>
              ) : sorted.map((b) => (
                <tr key={b.abbr} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <FurnisherLogo domain={b.domain} name={b.name} size="sm" />
                      <div className="min-w-0">
                        <div className="text-[11px] text-foreground truncate">{b.name}</div>
                        <div className="text-[9px] text-muted-foreground/50">{b.abbr}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded capitalize ${typeBadge(b.type)}`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[12px] font-medium text-foreground tabular-nums leading-none">{b.coverage}%</span>
                      <div className="w-16 h-1 bg-muted/50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary/50" style={{ width: `${b.coverage}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="text-[11px] font-medium text-foreground tabular-nums">
                      {(b.signals / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-[9px] text-muted-foreground/50">{b.reporting} reporting</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {canScrollMore && sorted.length > 4 && (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none h-8 bg-gradient-to-t from-card to-transparent flex items-end justify-center pb-1">
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40 animate-bounce" />
          </div>
        )}
      </div>
    </div>
  );
}