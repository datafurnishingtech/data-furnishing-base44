import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronDown } from "lucide-react";

const BUREAU_TYPE_LABELS = {
  consumer: "Consumer",
  business: "Business / Commercial",
  specialty: "Specialty",
  data_exchange: "Data Exchange",
};

const REPORTING_STATUSES = new Set([
  "confirmed_reports",
  "likely_reports",
  "optional_add_on",
  "delinquency_only",
]);

function normalizeDomain(value = "") {
  return value
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .trim()
    .toLowerCase();
}

function sortBureaus(data, key, dir) {
  return [...data].sort((a, b) => {
    const va = a[key];
    const vb = b[key];

    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === "string") return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return dir === "asc" ? va - vb : vb - va;
  });
}

export default function BureauComparisonTable() {
  const [sortKey, setSortKey] = useState("coverage");
  const [sortDir, setSortDir] = useState("desc");
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollRef = useRef(null);

  const { data: bureaus = [], isLoading } = useQuery({
    queryKey: ["bureaus"],
    queryFn: () => base44.entities.Bureau.list("bureau_name", 250),
    initialData: [],
  });

  const { data: coverageRows = [] } = useQuery({
    queryKey: ["productBureauCoverage"],
    queryFn: () => base44.entities.ProductBureauCoverage.list("-updated_date", 2000),
    initialData: [],
  });

  const coverageByBureau = useMemo(() => {
    return coverageRows.reduce((acc, row) => {
      if (!row.bureau_id) return acc;
      if (!acc[row.bureau_id]) acc[row.bureau_id] = { total: 0, reporting: 0 };
      acc[row.bureau_id].total += 1;
      if (REPORTING_STATUSES.has(row.reporting_status)) acc[row.bureau_id].reporting += 1;
      return acc;
    }, {});
  }, [coverageRows]);

  const rows = useMemo(() => {
    return bureaus
      .filter((bureau) => bureau.status !== "inactive")
      .map((bureau) => {
        const stats = coverageByBureau[bureau.id] || { total: 0, reporting: 0 };
        return {
          id: bureau.id,
          name: bureau.bureau_name || "Unnamed bureau",
          abbr: bureau.abbr || "",
          type: BUREAU_TYPE_LABELS[bureau.bureau_type] || bureau.bureau_type || "Unknown",
          bureauType: bureau.bureau_type || "unknown",
          domain: normalizeDomain(bureau.website_url || ""),
          coverage: stats.total ? Math.round((stats.reporting / stats.total) * 1000) / 10 : null,
          signalCount: stats.total,
          reportingSignals: stats.reporting,
        };
      });
  }, [bureaus, coverageByBureau]);

  const sorted = useMemo(() => sortBureaus(rows, sortKey, sortDir), [rows, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(checkScroll);
    return () => cancelAnimationFrame(frame);
  }, [sortKey, sortDir, sorted.length, isLoading, checkScroll]);

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
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground/60">
                <SortBtn k="type" label="Type" />
              </th>
              <th className="text-right px-3 py-2.5 font-medium text-muted-foreground/60">
                <div className="flex justify-end"><SortBtn k="coverage" label="Coverage" /></div>
              </th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground/60">
                <div className="flex justify-end"><SortBtn k="signalCount" label="Signals" /></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4].map((item) => (
                <tr key={item} className="border-b border-border/30">
                  <td className="px-4 py-3" colSpan={4}>
                    <div className="h-5 bg-muted/50 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[11px] text-muted-foreground/60" colSpan={4}>
                  No active bureaus found.
                </td>
              </tr>
            ) : (
              sorted.map((b) => (
                <tr key={b.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <FurnisherLogo domain={b.domain} name={b.name} size="sm" />
                      <div className="min-w-0">
                        <span className="text-[11px] text-foreground truncate block">{b.name}</span>
                        {b.abbr && <span className="text-[9px] text-muted-foreground/50">{b.abbr}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                      b.bureauType === "consumer" ? "text-primary/80" :
                      b.bureauType === "business" ? "text-amber-600" :
                      b.bureauType === "specialty" ? "text-muted-foreground/70" :
                      "text-secondary-foreground"
                    }`}>{b.type}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {b.coverage == null ? (
                      <span className="text-[10px] text-muted-foreground/50">No signals yet</span>
                    ) : (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[12px] font-medium text-foreground tabular-nums leading-none">{b.coverage}%</span>
                        <div className="w-16 h-1 bg-muted/50 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-primary/50" style={{ width: `${b.coverage}%` }} />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex flex-col items-end leading-tight">
                      <span className="text-[11px] tabular-nums font-medium text-foreground">{b.signalCount}</span>
                      <span className="text-[9px] text-muted-foreground/50">{b.reportingSignals} reporting</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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