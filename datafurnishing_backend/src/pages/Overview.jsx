import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import FurnisherCoverageHeatmap from "@/components/overview/FurnisherCoverageHeatmap";
import FurnisherTypePopover from "@/components/shared/FurnisherTypePopover";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from "recharts";
import { getRegistrySummary, getTopCompaniesByProductCount, getProductTypeHistogram } from "@/services/intelligenceService";
import { ArrowRight } from "lucide-react";

const topFurnishersFallback = [
  { rank: 1, name: "Synchrony Bank", domain: "synchrony.com", tradelines: "2.3M" },
  { rank: 2, name: "Capital One", domain: "capitalone.com", tradelines: "2.2M" },
  { rank: 3, name: "American Express", domain: "americanexpress.com", tradelines: "1.5M" },
  { rank: 4, name: "Citi", domain: "citibank.com", tradelines: "1.5M" },
  { rank: 5, name: "Barclays", domain: "barclays.co.uk", tradelines: "1.2M" },
];

const recentAlerts = [
  { title: "New furnisher onboarded", desc: "Brightway Financial Services", time: "2h ago", color: "bg-emerald-500" },
  { title: "Coverage drop detected", desc: "Regional Acceptance Corp.", time: "5h ago", color: "bg-amber-500" },
  { title: "Data quality issue", desc: "Metro 2 fields misaligned", time: "1d ago", color: "bg-destructive" },
  { title: "Bureau coverage threshold", desc: "TransUnion below 95%", time: "2d ago", color: "bg-amber-500" },
];

const productMixFallback = [
  { name: "Credit Cards", value: 42, color: "#4F46E5" }, { name: "Loans", value: 23, color: "#8B5CF6" },
  { name: "Auto Loans", value: 15, color: "#A78BFA" }, { name: "Mortgages", value: 10, color: "#C4B5FD" },
  { name: "Other", value: 10, color: "#DDD6FE" },
];

const trendData = [{ x: 1, y: 20 }, { x: 2, y: 25 }, { x: 3, y: 22 }, { x: 4, y: 30 }, { x: 5, y: 28 }, { x: 6, y: 35 }, { x: 7, y: 40 }];

const watchlistData = [
  { name: "High Priority Furnishers", items: 28 }, { name: "Growth Opportunities", items: 16 },
  { name: "Data Quality Watch", items: 9 }, { name: "Coverage Gaps", items: 14 }, { name: "New Onboardings", items: 7 },
];

const recentActivity = [
  { title: "New furnisher onboarded", desc: "Brightway Financial", time: "2h ago", color: "bg-emerald-500" },
  { title: "Coverage threshold alert", desc: "American Express", time: "5h ago", color: "bg-amber-400" },
  { title: "Data quality issue resolved", desc: "Midland Credit Management", time: "1d ago", color: "bg-destructive" },
];

export default function Overview() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedState, setSelectedState] = useState(null);

  const { data: registry, isLoading: registryLoading } = useQuery({ queryKey: ["overview-registry"], queryFn: getRegistrySummary, staleTime: 60_000 });
  const { data: topByProducts = [], isLoading: topLoading } = useQuery({ queryKey: ["overview-top-furnishers"], queryFn: () => getTopCompaniesByProductCount(5), staleTime: 60_000 });
  const { data: productTypeHistogram = {}, isLoading: histogramLoading } = useQuery({ queryKey: ["overview-product-histogram"], queryFn: getProductTypeHistogram, staleTime: 60_000 });

  const totalProducts = registry?.productCount ?? 0;
  const statsLoading = registryLoading || topLoading || histogramLoading;

  const liveTopFurnishers = topByProducts.map((entry, index) => ({
    rank: index + 1, name: entry.company.company_name, domain: entry.company.domain,
    slug: entry.company.slug || entry.company.company_id, tradelines: entry.productCount.toLocaleString(),
  }));

  const liveProductMix = Object.entries(productTypeHistogram).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count], index) => ({
    name: name.replace(/_/g, " "), value: totalProducts ? Math.round((count / totalProducts) * 100) : 0,
    color: productMixFallback[index]?.color || "#4F46E5",
  }));

  const overviewTopFurnishers = liveTopFurnishers.length ? liveTopFurnishers : topFurnishersFallback.map((f) => ({ ...f, slug: null }));
  const overviewProductMix = liveProductMix.length ? liveProductMix : productMixFallback;
  const bureauCoverageDisplay = registry?.bureauCoveragePct != null ? `${registry.bureauCoveragePct}%` : "—";

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader title="Overview" subtitle="Data furnishing intelligence at a glance" />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Furnishers" value={statsLoading ? "—" : (registry?.companyCount ?? 0).toLocaleString()} change={2.4} />
          <StatCard label="Verified Furnishers" value={statsLoading ? "—" : (registry?.verifiedCompanyCount ?? 0).toLocaleString()} change={1.8} />
          <StatCard label="Total Products" value={statsLoading ? "—" : totalProducts.toLocaleString()} change={5.2} />
          <StatCard label="Bureau Coverage" value={bureauCoverageDisplay} change={2.1} />
        </div>

        {/* Heatmap + Top Furnishers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-[11.5px] font-medium text-foreground">Furnisher Coverage Heatmap</h3>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">Click any state to explore</p>
              </div>
              <FurnisherTypePopover value={typeFilter} onChange={(v) => { setTypeFilter(v); setSelectedState(null); }} />
            </div>
            <FurnisherCoverageHeatmap typeFilter={typeFilter} selectedState={selectedState} onStateSelect={setSelectedState} />
          </div>
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11.5px] font-medium text-foreground">Top Furnishers by Volume</h3>
              <Link to="/furnishers" className="text-[10px] text-primary/70 hover:text-primary transition-colors">View all</Link>
            </div>
            <div className="space-y-2.5">
              {overviewTopFurnishers.map((f) => (
                <div key={f.rank} className="flex items-center gap-2.5">
                  <span className="text-[9px] text-muted-foreground/40 w-4 shrink-0 tabular-nums">{f.rank}</span>
                  <FurnisherLogo domain={f.domain} name={f.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-foreground truncate">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground/60 tabular-nums">{f.tradelines} tradelines</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/furnishers" className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors mt-4">
              View all furnishers <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Alerts + Product Mix + Watchlist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11.5px] font-medium text-foreground">Recent Alerts</h3>
              <Link to="/alerts" className="text-[10px] text-primary/70 hover:text-primary transition-colors">View all</Link>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${a.color} mt-1.5 shrink-0`} />
                  <div>
                    <div className="text-[11px] font-normal text-foreground">{a.title}</div>
                    <div className="text-[10px] text-muted-foreground/60">{a.desc}</div>
                    <div className="text-[10px] text-muted-foreground/40 tabular-nums mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border/60 p-5">
            <h3 className="text-[11.5px] font-medium text-foreground mb-3">Product Mix</h3>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={overviewProductMix} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value">
                  {overviewProductMix.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {overviewProductMix.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-muted-foreground/70 capitalize">{p.name}</span>
                  </div>
                  <span className="font-medium text-foreground tabular-nums">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11.5px] font-medium text-foreground">Watchlist Snapshot</h3>
              <Link to="/watchlists" className="text-[10px] text-primary/70 hover:text-primary transition-colors">View all</Link>
            </div>
            <div className="space-y-2">
              {watchlistData.map((w) => (
                <div key={w.name} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground/70 truncate">{w.name}</span>
                  <span className="text-[11px] font-medium text-foreground ml-2 shrink-0 tabular-nums">{w.items}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right insights panel */}
      <div className="w-[220px] border-l border-border/60 bg-card overflow-y-auto hidden xl:block">
        <div className="p-4 border-b border-border/60">
          <h3 className="text-[11.5px] font-medium text-foreground">Insights</h3>
        </div>
        <div className="p-4 space-y-5">
          <div>
            <h4 className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] mb-1.5">Coverage</h4>
            <div className="text-[22px] font-semibold text-primary leading-none">{bureauCoverageDisplay}</div>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Tri-bureau product coverage</p>
          </div>
          <div>
            <h4 className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] mb-1.5">Trend</h4>
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={trendData}>
                <Area type="monotone" dataKey="y" stroke="#4B41CE" fill="#4B41CE" fillOpacity={0.1} strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] mb-1.5">Data Quality</h4>
            <div className="text-[22px] font-semibold text-foreground leading-none">{statsLoading ? "—" : `${registry?.avgConfidence ?? 0}%`}</div>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Avg. company confidence</p>
          </div>
          <div>
            <h4 className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] mb-2">Activity</h4>
            <div className="space-y-2.5">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <div className={`w-0.5 h-3.5 rounded-full ${a.color} mt-0.5 shrink-0`} />
                  <div>
                    <div className="text-[10px] font-normal text-foreground">{a.title}</div>
                    <div className="text-[10px] text-muted-foreground/50 tabular-nums">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}