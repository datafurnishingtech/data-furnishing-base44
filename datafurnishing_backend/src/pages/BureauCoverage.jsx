import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { ArrowUp, ArrowDown, ArrowRight, Search, Filter, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import USCoverageHeatmap from "@/components/overview/USCoverageHeatmap";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import BureauComparisonTable from "@/components/bureauCoverage/BureauComparisonTable";
import CoverageFilters from "@/components/bureauCoverage/CoverageFilters";
import FurnisherCoveragePanel from "@/components/bureauCoverage/FurnisherCoveragePanel";
import { listProductsPaged, getProductCount, getCompanyCount } from "@/services/intelligenceService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { US_STATE_ABBREV_TO_NAME } from "@/lib/usStates";

const PAGE_SIZE = 8;

const BUREAU_LEGEND = [
  { abbr: "EX",  name: "Experian" },
  { abbr: "EQ",  name: "Equifax" },
  { abbr: "TU",  name: "TransUnion" },
  { abbr: "IN",  name: "Innovis" },
  { abbr: "SB",  name: "SBFE" },
  { abbr: "ESB", name: "Experian Small Business" },
  { abbr: "D&B", name: "Dun & Bradstreet" },
];

function abbrevFromBureauToken(s) {
  const x = String(s || "").toLowerCase();
  if (x.includes("experian") && x.includes("small")) return "ESB";
  if (x.includes("experian")) return "EX";
  if (x.includes("equifax")) return "EQ";
  if (x.includes("trans")) return "TU";
  if (x.includes("innovis")) return "IN";
  if (x.includes("sbfe")) return "SB";
  if (x.includes("dun") || x.includes("bradstreet")) return "D&B";
  return String(s || "").replace(/\s+/g, "").slice(0, 3).toUpperCase();
}

function coveragePctFromBureaus(bureaus) {
  if (!bureaus?.length) return 0;
  const lower = bureaus.map((b) => String(b).toLowerCase());
  let n = 0;
  if (lower.some((b) => b.includes("equifax"))) n += 1;
  if (lower.some((b) => b.includes("experian") && !b.includes("small"))) n += 1;
  if (lower.some((b) => b.includes("trans"))) n += 1;
  return Math.round((n / 3) * 100);
}

function confidenceLabel(score) {
  const v = Number(score) || 0;
  if (v >= 70) return "High";
  if (v >= 40) return "Medium";
  return "Low";
}

function confidenceColor(label) {
  if (label === "High") return "text-emerald-500";
  if (label === "Medium") return "text-amber-500";
  return "text-destructive";
}

export default function BureauCoverage() {
  const navigate = useNavigate();
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [typeFilter, setTypeFilter]       = useState("all");
  const [page, setPage]                   = useState(1);
  const [selectedRow, setSelectedRow]     = useState(null);
  const [panelDismissed, setPanelDismissed] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data: productCount = 0 } = useQuery({ queryKey: ["bc-product-total"], queryFn: getProductCount, staleTime: 60_000 });
  const { data: companyCount = 0 } = useQuery({ queryKey: ["bc-company-total"], queryFn: getCompanyCount, staleTime: 60_000 });

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["bureau-coverage-directory", page, debouncedSearch],
    queryFn: () => listProductsPaged({ page, pageSize: PAGE_SIZE, search: debouncedSearch, includeCompanyInSearch: true }),
    staleTime: 30_000,
  });

  const rows = pageData?.rows || [];
  const total = pageData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const directoryRows = useMemo(() => rows.map((p) => {
    const c = p.company;
    const bureaus = [...new Set((p.bureaus_reported || []).map(abbrevFromBureauToken))];
    const coverage = coveragePctFromBureaus(p.bureaus_reported || []);
    const score = Number(p.data_completeness_score ?? p.confidence_score ?? 0);
    return {
      key: p.product_id,
      product: p,
      furnisherName: c?.company_name || "—",
      domain: c?.domain || "",
      productName: p.product_name || "—",
      productType: p.product_type || "—",
      bureaus,
      coverage,
      confidence: confidenceLabel(score),
      trend: score >= 70 ? "up" : score >= 40 ? "right" : "down",
      slug: c?.slug || c?.company_id,
    };
  }), [rows]);

  const displaySelected = useMemo(() => {
    if (panelDismissed || !directoryRows.length) return null;
    if (selectedRow && directoryRows.some((r) => r.key === selectedRow.key)) return selectedRow;
    return directoryRows[0];
  }, [directoryRows, selectedRow, panelDismissed]);

  return (
    <div className="p-6 min-h-full bg-background">
      {/* Header */}
      <PageHeader
        title="Bureau Coverage"
        subtitle="Map where products and furnishers report across consumer and business bureaus."
      >
        <button className="h-7 px-2.5 flex items-center gap-1.5 text-[11px] font-normal text-muted-foreground border border-border/60 rounded-md hover:bg-muted/50 hover:text-foreground transition-colors">
          <Filter className="w-3 h-3" /> Filters
        </button>
      </PageHeader>

      {/* 5-column KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Covered Furnishers"      value={companyCount.toLocaleString()} change={3.4} />
        <StatCard label="Consumer Bureau Cov."    value="98.1%" change={1.2} />
        <StatCard label="Business Bureau Cov."    value="86.7%" change={2.8} />
        <StatCard label="Verified Cov. Signals"   value="24.6M" change={5.1} />
        {/* Custom coverage trend card */}
        <div className="bg-card rounded-lg border border-border/60 px-4 py-3.5 flex flex-col gap-2 min-w-0">
          <div className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground/70 truncate">Coverage Trend</div>
          <div className="text-[14px] font-medium text-emerald-500 leading-none tracking-tight">Upward</div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground/60">Consistent improvement</span>
          </div>
        </div>
      </div>

      {/* Two-column analytics grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Heatmap card */}
        <div className="bg-card rounded-lg border border-border/60 p-5">
          <div className="text-[11.5px] font-medium text-foreground mb-0.5">U.S. Consumer Coverage Heatmap</div>
          <div className="text-[10px] text-muted-foreground/60 mb-3">Coverage % of active tradelines reported by state — hover for detail</div>
          <USCoverageHeatmap />
          <div className="flex items-center justify-between mt-2.5">
            <div>
              <div className="text-[14px] font-medium text-foreground leading-none">98.1%</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">National avg. coverage</div>
            </div>
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors">View state details →</button>
          </div>
        </div>

        {/* Bureau comparison table */}
        <BureauComparisonTable isLoading={false} />
      </div>

      {/* Bottom section — directory + panel */}
      <div className="flex gap-6">
        {/* Directory */}
        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-lg border border-border/60 overflow-hidden">
            {/* Directory header */}
            <div className="px-4 py-3 border-b border-border/50">
              <div className="text-[11.5px] font-medium text-foreground mb-0.5">Furnisher Coverage Directory</div>
              <div className="text-[10px] text-muted-foreground/60 mb-2.5">Explore coverage by furnisher, product, and bureau.</div>
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
                  <Input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search furnishers or products..."
                    className="pl-8 h-7 text-[11px] border-border/60 bg-transparent placeholder:text-muted-foreground rounded-md"
                  />
                </div>
                <CoverageFilters
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  typeFilter={typeFilter}
                  onTypeChange={setTypeFilter}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="text-left px-4 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap">Furnisher</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap">Product</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden lg:table-cell">Product Type</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden sm:table-cell">Covered Bureaus</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap">Coverage %</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden sm:table-cell">Confidence</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={7} className="text-center py-8 text-[11px] text-muted-foreground/50">Loading…</td></tr>
                  ) : directoryRows.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-[11px] text-muted-foreground/60">No products match your filters.</td></tr>
                  ) : directoryRows.map((f) => (
                    <tr
                      key={f.key}
                      onClick={() => { setPanelDismissed(false); setSelectedRow(f); }}
                      className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${displaySelected?.key === f.key ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <FurnisherLogo domain={f.domain} name={f.furnisherName} size="sm" />
                          <span className="text-[11px] font-normal text-foreground truncate max-w-[120px]">{f.furnisherName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-foreground/70 max-w-[140px]">
                        <div className="truncate">{f.productName}</div>
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-foreground/70 capitalize hidden lg:table-cell whitespace-nowrap">{f.productType.replace(/_/g, " ")}</td>
                      <td className="px-3 py-2.5 hidden sm:table-cell">
                        <div className="flex gap-0.5 flex-wrap">
                          {f.bureaus.length
                            ? f.bureaus.map((b) => <span key={b} className="text-[9px] font-medium bg-primary/10 text-primary px-1 py-0.5 rounded">{b}</span>)
                            : <span className="text-muted-foreground/40 text-[10px]">—</span>}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-foreground tabular-nums whitespace-nowrap">{f.coverage}%</td>
                      <td className={`px-3 py-2.5 text-[10px] font-medium hidden sm:table-cell ${confidenceColor(f.confidence)}`}>{f.confidence}</td>
                      <td className="px-3 py-2.5">
                        {f.trend === "up"
                          ? <ArrowUp className="w-3 h-3 text-emerald-500" />
                          : f.trend === "down"
                          ? <ArrowDown className="w-3 h-3 text-destructive" />
                          : <ArrowRight className="w-3 h-3 text-muted-foreground/40" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground/60">
                Showing{" "}
                <span className="text-foreground/70 font-medium">{Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)}</span>
                {" "}of{" "}
                <span className="text-foreground/70 font-medium">{total.toLocaleString()}</span> results
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-6 h-6 flex items-center justify-center text-[10px] rounded text-muted-foreground/60 hover:bg-muted disabled:text-muted-foreground/30 disabled:cursor-not-allowed transition-colors"
                >‹</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-6 h-6 flex items-center justify-center text-[10px] rounded transition-colors ${p === page ? "bg-primary text-white" : "text-muted-foreground/60 hover:bg-muted"}`}
                  >{p}</button>
                ))}
                {totalPages > 5 && <span className="text-muted-foreground/40 text-[10px] px-1">…{totalPages}</span>}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-6 h-6 flex items-center justify-center text-[10px] rounded text-muted-foreground/60 hover:bg-muted disabled:text-muted-foreground/30 disabled:cursor-not-allowed transition-colors"
                >›</button>
              </div>
            </div>

            {/* Bureau legend */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border/30 flex-wrap">
              <span className="text-[10px] font-medium text-foreground/70">Bureaus:</span>
              {BUREAU_LEGEND.map((b) => (
                <span key={b.abbr} className="text-[10px] text-muted-foreground/60">
                  <span className="font-medium text-foreground/70">{b.abbr}</span> {b.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        {displaySelected && (
          <div className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
              <FurnisherCoveragePanel
                furnisher={displaySelected}
                onClose={() => setPanelDismissed(true)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}