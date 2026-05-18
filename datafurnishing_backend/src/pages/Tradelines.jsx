import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, X, ChevronRight, Filter, ShieldCheck, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { listProductsPaged, listProductBureauReporting, getProductCount, getProductBySlug, getProductTypeHistogram } from "@/services/intelligenceService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const impactFactors = [
  { name: "Payment history", value: 40, color: "#4F46E5" },
  { name: "Utilization",     value: 25, color: "#8B5CF6" },
  { name: "Age of acct.",    value: 15, color: "#A78BFA" },
  { name: "Mix of credit",   value: 10, color: "#C4B5FD" },
  { name: "Other factors",   value: 10, color: "#DDD6FE" },
];

const distributionData = [
  { range: "0–20",  value: 900000  },
  { range: "21–40", value: 1800000 },
  { range: "41–60", value: 4200000 },
  { range: "61–80", value: 6700000 },
  { range: "81–100",value: 11000000},
];

const PAGE_SIZE = 20;

function scoreBg(score) {
  if (score >= 85) return "bg-primary";
  if (score >= 75) return "bg-primary/70";
  return "bg-primary/40";
}

export default function Tradelines() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [selected, setSelected]     = useState(null);
  const [panelOpen, setPanelOpen]   = useState(false);
  const [search, setSearch]         = useState("");
  const debouncedSearch             = useDebouncedValue(search, 400);
  const [typeFilter, setTypeFilter] = useState("all");
  const [bureauFilter, setBureauFilter]       = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: histogram = {} } = useQuery({ queryKey: ["product-type-histogram"], queryFn: getProductTypeHistogram, staleTime: 120_000 });
  const productTypes = useMemo(() => Object.keys(histogram).sort(), [histogram]);
  const { data: totalProductCount = 0 } = useQuery({ queryKey: ["products-total-count"], queryFn: getProductCount });

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["products-paged", page, debouncedSearch, typeFilter, bureauFilter, frequencyFilter],
    queryFn: () => listProductsPaged({ page, pageSize: PAGE_SIZE, search: debouncedSearch, productType: typeFilter, bureau: bureauFilter, target: "all", companyId: null, reportingFrequency: frequencyFilter }),
    placeholderData: (p) => p,
  });

  const products     = pageData?.rows ?? [];
  const totalFiltered = pageData?.total ?? 0;
  const totalPages   = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));

  const { data: slugProduct, isLoading: slugLoading } = useQuery({
    queryKey: ["product-by-slug", slug],
    queryFn:  () => getProductBySlug(decodeURIComponent(slug)),
    enabled:  Boolean(slug),
  });

  const { data: bureauReporting = [] } = useQuery({
    queryKey: ["product-bureau-reporting", products.map((p) => p.product_id).join(",")],
    queryFn:  () => listProductBureauReporting(products.map((p) => p.product_id)),
    enabled:  products.length > 0,
  });

  useEffect(() => { setPage(1); }, [debouncedSearch, typeFilter, bureauFilter, frequencyFilter]);

  useEffect(() => {
    if (slug && slugProduct) { setSelected(slugProduct); setPanelOpen(true); return; }
    if (slug && !slugLoading && !slugProduct) { setSelected(null); setPanelOpen(false); return; }
  }, [slug, slugProduct, slugLoading]);

  useEffect(() => {
    if (!slug && products.length && !selected) {
      setSelected(products[0]); setPanelOpen(true);
    }
  }, [products]);

  const selectedBureauReporting = bureauReporting.filter((r) => r.product_id === selected?.product_id);

  const handleSelect = (product) => {
    setSelected(product); setPanelOpen(true);
    navigate(`/tradelines/${product.product_slug || product.product_id}`);
  };

  const handleClosePanel = () => { setSelected(null); setPanelOpen(false); };

  const hasActiveFilters = search || typeFilter !== "all" || bureauFilter !== "all" || frequencyFilter !== "all";
  const handleClear = () => { setSearch(""); setTypeFilter("all"); setBureauFilter("all"); setFrequencyFilter("all"); setPage(1); };
  const gotoPage = (p) => setPage(p);

  const highQuality = products.filter((p) => Number(p.data_completeness_score || 0) >= 70).length;

  return (
    <div className="p-6 min-h-full bg-background">
      {/* Page header */}
      <PageHeader
        title="Tradeline Intelligence"
        subtitle="Explore what gets reported, how often, and which tradelines drive the most impact."
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Tradelines"       value={totalProductCount.toLocaleString()} change={11.8} />
        <StatCard label="High-Impact Tradelines" value="8.2M" change={4.3} />
        <StatCard label="Verified Products"      value={totalFiltered.toLocaleString()} />
        <StatCard label="Coverage Consistency"   value="98.1%" change={0.4} />
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* LEFT — table + chart */}
        <div className="flex-1 min-w-0">

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by product or furnisher..."
                className="pl-8 h-7 text-[11px] border-border/60 bg-transparent placeholder:text-muted-foreground"
              />
            </div>

            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="h-7 text-[11px] w-auto min-w-[100px] border-border/60 bg-transparent text-muted-foreground font-normal"><SelectValue placeholder="Product type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-[11px]">All types</SelectItem>
                {productTypes.map((t) => <SelectItem key={t} value={t} className="text-[11px] capitalize">{t.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={bureauFilter} onValueChange={(v) => { setBureauFilter(v); setPage(1); }}>
              <SelectTrigger className="h-7 text-[11px] w-auto min-w-[100px] border-border/60 bg-transparent text-muted-foreground font-normal"><SelectValue placeholder="Bureau" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-[11px]">All bureaus</SelectItem>
                {["Equifax","Experian","TransUnion","TU","EQ","EX"].map((b) => <SelectItem key={b} value={b} className="text-[11px]">{b}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={frequencyFilter} onValueChange={(v) => { setFrequencyFilter(v); setPage(1); }}>
              <SelectTrigger className="h-7 text-[11px] w-auto min-w-[100px] border-border/60 bg-transparent text-muted-foreground font-normal"><SelectValue placeholder="Reporting frequency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-[11px]">All frequencies</SelectItem>
                {["weekly","monthly","real_time","other","unknown"].map((f) => <SelectItem key={f} value={f} className="text-[11px] capitalize">{f.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <button onClick={handleClear} className="text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors">
                Clear filters
              </button>
            )}
          </div>

          {/* Table card */}
          <div className="bg-card rounded-lg border border-border/60 overflow-hidden mb-5">
            {/* Table title bar */}
            <div className="px-4 py-2.5 border-b border-border/50">
              <span className="text-[11.5px] font-medium text-foreground">Tradelines</span>
              <span className="text-[11.5px] font-normal text-muted-foreground/50 ml-1.5">({totalFiltered.toLocaleString()})</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="px-3 py-2.5 w-8" />
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap">Product Name</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden md:table-cell">Furnisher</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden lg:table-cell">Type</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden sm:table-cell">Bureaus</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap">Impact Score</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden xl:table-cell">Frequency</th>
                    <th className="px-3 py-2.5 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={8} className="text-center py-16 text-[11px] text-muted-foreground/50">Loading products…</td></tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="text-[13px] font-medium text-foreground/50">No products found</div>
                          <div className="text-[11px] text-muted-foreground/40">Try adjusting your search or filters</div>
                        </div>
                      </td>
                    </tr>
                  ) : products.map((t) => {
                    const score = Math.round(t.data_completeness_score || t.confidence_score || 0);
                    const isSelected = selected?.product_id === t.product_id;
                    return (
                      <tr
                        key={t.product_id}
                        onClick={() => handleSelect(t)}
                        className={`border-b border-border/30 last:border-0 cursor-pointer transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-muted/20"}`}
                      >
                        <td className="px-3 py-2.5">
                          <Star className={`w-3 h-3 ${score >= 80 ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-foreground max-w-[180px]">
                          <div className="truncate">{t.product_name}</div>
                        </td>
                        <td className="px-3 py-2.5 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            {t.company?.domain && <FurnisherLogo domain={t.company.domain} name={t.company.company_name} size="xs" />}
                            <span className="text-[11px] text-foreground/70 truncate max-w-[120px]">{t.company?.company_name || "—"}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-foreground/70 capitalize whitespace-nowrap hidden lg:table-cell">{t.product_type?.replace(/_/g, " ") || "—"}</td>
                        <td className="px-3 py-2.5 hidden sm:table-cell">
                          <div className="flex gap-0.5">
                            {(t.bureaus_reported || []).slice(0, 3).map((b) => (
                              <span key={b} className="text-[9.5px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded whitespace-nowrap">{b}</span>
                            ))}
                            {!t.bureaus_reported?.length && <span className="text-muted-foreground/30 text-[10px]">—</span>}
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex items-center justify-center w-8 h-5 rounded text-[10px] font-semibold text-white ${scoreBg(score)}`}>
                            {score}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-foreground/70 capitalize whitespace-nowrap hidden xl:table-cell">{t.reporting_frequency || "—"}</td>
                        <td className="px-3 py-2.5">
                          <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                Showing{" "}
                <span className="text-foreground/70 font-medium">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalFiltered)}</span>
                {" "}of{" "}
                <span className="text-foreground/70 font-medium">{totalFiltered.toLocaleString()}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => gotoPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="h-7 px-1.5 min-w-[28px] text-[10.5px] rounded font-medium text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground disabled:text-muted-foreground/30 disabled:cursor-not-allowed transition-colors"
                >Prev</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => gotoPage(p)}
                    className={`h-7 min-w-[28px] px-1.5 text-[10.5px] rounded flex items-center justify-center font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground"}`}
                  >{p}</button>
                ))}
                {totalPages > 7 && <span className="text-muted-foreground/40 text-[10px] px-1">…{totalPages}</span>}
                <button
                  onClick={() => gotoPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="h-7 px-1.5 min-w-[28px] text-[10.5px] rounded font-medium text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground disabled:text-muted-foreground/30 disabled:cursor-not-allowed transition-colors"
                >Next</button>
              </div>
            </div>
          </div>

          {/* Distribution chart card */}
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[11.5px] font-medium text-foreground">Impact Score Distribution</div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">Tradelines by score range</div>
              </div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} barSize={28}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} strokeDasharray="3 3" />
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }}
                    formatter={(v) => [`${(v / 1000000).toFixed(2)}M`, "Tradelines"]}
                  />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {distributionData.map((_, i) => (
                      <Cell key={i} fill={i === distributionData.length - 1 ? "#4F46E5" : "rgba(167,139,250,0.5)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT — detail panel */}
        {panelOpen && selected && (
          <div className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
              <TradelineDetailPanel
                product={selected}
                bureauReporting={selectedBureauReporting}
                onClose={handleClosePanel}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile slide-up panel */}
      {panelOpen && selected && (
        <div className="lg:hidden fixed inset-0 z-30 flex flex-col justify-end" onClick={handleClosePanel}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-background rounded-t-xl border-t border-border/60 max-h-[75vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />
            <div className="flex-1 overflow-y-auto p-4">
              <TradelineDetailPanel
                product={selected}
                bureauReporting={selectedBureauReporting}
                onClose={handleClosePanel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DETAIL_TABS = ["Overview", "Trend", "Bureaus", "Comparables"];

const useCases = [
  "Credit risk modeling",
  "Lending decisioning",
  "Portfolio monitoring",
];

function TradelineDetailPanel({ product, bureauReporting, onClose }) {
  const [tab, setTab] = useState("Overview");
  const score  = Math.round(product.data_completeness_score || product.confidence_score || 0);
  const bureaus = product.bureaus_reported?.join(", ") || bureauReporting.map((r) => r.bureau).join(", ") || "—";

  const attrs = [
    ["Furnisher",    product.company?.company_name || "—"],
    ["Product type", product.product_type?.replace(/_/g, " ") || "—"],
    ["Bureaus",      bureaus],
    ["Frequency",    product.reporting_frequency || "—"],
  ];

  const donutData = [
    { value: score,       fill: "#4F46E5" },
    { value: 100 - score, fill: "#E5E7EB" },
  ];

  return (
    <div>
      {/* Panel header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-0.5 h-3.5 bg-primary/60 rounded-full flex-shrink-0" />
          <div className="text-[11.5px] font-medium text-foreground truncate">{product.product_name}</div>
        </div>
        <button onClick={onClose} className="flex-shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors ml-2">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-4 border-b border-border/50">
        {DETAIL_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-2 py-1.5 text-[10.5px] border-b-2 transition-colors ${
              tab === t
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground/60 hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <>
          {/* Impact score donut */}
          <div className="mb-3">
            <div className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Impact Score</div>
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <PieChart width={64} height={64}>
                  <Pie data={donutData} cx={28} cy={28} innerRadius={22} outerRadius={30} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                    {donutData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[14px] font-semibold text-foreground leading-none">{score}</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                {impactFactors.map((f) => (
                  <div key={f.name} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: f.color }} />
                    <span className="text-[10px] text-foreground truncate flex-1">{f.name}</span>
                    <span className="text-[10px] text-muted-foreground/60 tabular-nums ml-auto">{f.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground/60 mt-1.5">Based on FCRA-weighted model</div>
          </div>

          {/* Top use cases */}
          <div className="pt-2.5 border-t border-border/40 mb-2.5">
            <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/70 mb-1.5">Top Use Cases</div>
            <div className="space-y-0.5">
              {useCases.map((uc) => (
                <div key={uc} className="flex items-center gap-2 py-0.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-[10.5px] text-foreground/80 flex-1">{uc}</span>
                  <button className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors">
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Key attributes */}
          <div className="pt-2.5 border-t border-border/40">
            <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/70 mb-2">Key Attributes</div>
            <div className="space-y-1.5">
              {attrs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground/60">{k}</span>
                  <span className="text-[10px] font-medium text-foreground text-right capitalize truncate">{v}</span>
                </div>
              ))}
              <div className="flex justify-between gap-2">
                <span className="text-[10px] text-muted-foreground/60">Verification</span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {tab !== "Overview" && (
        <div className="py-8 text-center text-[11px] text-muted-foreground/40">
          {tab} data coming soon
        </div>
      )}
    </div>
  );
}