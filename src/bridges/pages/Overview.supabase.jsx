import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AnimatedBar from "@/components/shared/AnimatedBar";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Building2, TrendingUp, Globe, Package, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import FurnisherCoverageHeatmap from "@/components/overview/FurnisherCoverageHeatmap";
import FurnisherTypePopover from "@/components/shared/FurnisherTypePopover";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from "recharts";
import { getRegistrySummary, getTopCompaniesByProductCount, getProductTypeHistogram, listProductsPaged } from "@/services/intelligenceService";

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
  { name: "Credit Cards", value: 42, color: "#4F46E5" },
  { name: "Loans", value: 23, color: "#8B5CF6" },
  { name: "Auto Loans", value: 15, color: "#A78BFA" },
  { name: "Mortgages", value: 10, color: "#C4B5FD" },
  { name: "Other", value: 10, color: "#DDD6FE" },
];

const watchlistData = [
  { name: "High Priority Furnishers", items: 28 },
  { name: "Growth Opportunities", items: 16 },
  { name: "Data Quality Watch", items: 9 },
  { name: "Coverage Gaps", items: 14 },
  { name: "New Onboardings", items: 7 },
];

const tradeActivityFallback = [
  { id: "TRD-982731", furnisher: "Synchrony Bank", domain: "synchrony.com", product: "Credit Card", bureau: "TransUnion", date: "May 31, 2025", status: "Verified" },
  { id: "TRD-982730", furnisher: "Capital One", domain: "capitalone.com", product: "Credit Card", bureau: "Equifax", date: "May 31, 2025", status: "Verified" },
  { id: "TRD-982729", furnisher: "American Express", domain: "americanexpress.com", product: "Charge Card", bureau: "Experian", date: "May 31, 2025", status: "Verified" },
  { id: "TRD-982728", furnisher: "Citi", domain: "citibank.com", product: "Personal Loan", bureau: "TransUnion", date: "May 31, 2025", status: "Pending" },
  { id: "TRD-982727", furnisher: "Barclays", domain: "barclays.co.uk", product: "Credit Card", bureau: "Equifax", date: "May 31, 2025", status: "Verified" },
];

const trendData = [
  { x: 1, y: 20 }, { x: 2, y: 25 }, { x: 3, y: 22 }, { x: 4, y: 30 }, { x: 5, y: 28 }, { x: 6, y: 35 }, { x: 7, y: 40 },
];

const recentActivity = [
  { title: "New furnisher onboarded", desc: "Brightway Financial", time: "2h ago", color: "bg-emerald-500" },
  { title: "Coverage threshold alert", desc: "American Express", time: "5h ago", color: "bg-amber-400" },
  { title: "Data quality issue resolved", desc: "Midland Credit Management", time: "1d ago", color: "bg-destructive" },
];

export default function Overview() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedState, setSelectedState] = useState(null);

  const handleTypeFilterChange = (val) => {
    setTypeFilter(val);
    setSelectedState(null);
  };

  const { data: registry, isLoading: statsLoading } = useQuery({
    queryKey: ["overview-registry"],
    queryFn: getRegistrySummary,
    staleTime: 60_000,
  });
  const { data: topByProducts = [] } = useQuery({
    queryKey: ["overview-top-furnishers"],
    queryFn: () => getTopCompaniesByProductCount(5),
    staleTime: 60_000,
  });
  const { data: productTypeHistogram = {} } = useQuery({
    queryKey: ["overview-product-histogram"],
    queryFn: getProductTypeHistogram,
    staleTime: 60_000,
  });
  const { data: recentProductsPage } = useQuery({
    queryKey: ["overview-recent-products"],
    queryFn: () => listProductsPaged({ page: 1, pageSize: 5 }),
    staleTime: 60_000,
  });

  const totalProducts = registry?.productCount ?? 0;
  const topFurnishers = useMemo(() => {
    if (!topByProducts.length) return topFurnishersFallback;
    return topByProducts.map((entry, index) => ({
      rank: index + 1,
      name: entry.company?.company_name || "—",
      domain: entry.company?.domain || entry.company?.website_url?.replace(/^https?:\/\//, "").split("/")[0] || "",
      tradelines: entry.productCount.toLocaleString(),
    }));
  }, [topByProducts]);

  const productMix = useMemo(() => {
    const entries = Object.entries(productTypeHistogram || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!entries.length) return productMixFallback;
    return entries.map(([name, count], index) => ({
      name: String(name).replace(/_/g, " "),
      value: totalProducts ? Math.round((count / totalProducts) * 100) : 0,
      color: productMixFallback[index]?.color || "#4F46E5",
    }));
  }, [productTypeHistogram, totalProducts]);

  const tradeActivity = useMemo(() => {
    const rows = recentProductsPage?.rows || [];
    if (!rows.length) return tradeActivityFallback;
    return rows.map((p) => ({
      id: String(p.product_id || "").slice(0, 12),
      furnisher: p.company?.company_name || "—",
      domain: p.company?.domain || "",
      product: p.product_name || "—",
      bureau: (p.bureaus_reported || [])[0] || "—",
      date: p.updated_at ? new Date(p.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—",
      status: p.verification_status === "verified" ? "Verified" : "Pending",
    }));
  }, [recentProductsPage]);

  const bureauCoveragePct = registry?.bureauCoveragePct != null ? `${registry.bureauCoveragePct}%` : "98.1%";

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-w-0">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <PageHeader
          title="Dashboard Overview"
          subtitle="Your Data Furnishing Intelligence Command Center"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard label="Furnishers" value={statsLoading ? "—" : (registry?.companyCount ?? 0).toLocaleString()} change={12.5} />
          <StatCard label="Tradelines" value={statsLoading ? "—" : totalProducts.toLocaleString()} change={11.8} />
          <StatCard label="Bur. Coverage" value={statsLoading ? "—" : bureauCoveragePct} change={2.4} />
          <StatCard label="Products" value={statsLoading ? "—" : totalProducts.toLocaleString()} change={15.1} />
          <StatCard label="Verified Srcs." value={statsLoading ? "—" : (registry?.verifiedCompanyCount ?? 0).toLocaleString()} change={10.3} />
        </div>

        {/* Heatmap + Top Furnishers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Heatmap */}
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-[11.5px] font-medium text-foreground">Furnisher Coverage Heatmap</h3>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">Click any state to explore mapped furnishers</p>
              </div>
              <FurnisherTypePopover value={typeFilter} onChange={handleTypeFilterChange} />
            </div>
            <FurnisherCoverageHeatmap typeFilter={typeFilter} selectedState={selectedState} onStateSelect={setSelectedState} />
          </div>

          {/* Top Furnishers */}
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11.5px] font-medium text-foreground">Top Furnishers by Volume</h3>
              <Link to="/furnishers" className="text-[10px] text-primary/70 hover:text-primary transition-colors">View all</Link>
            </div>
            <div className="overflow-x-auto"><table className="w-full min-w-[480px]">
              <thead>
                <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                  <th className="text-left pb-2 font-medium">#</th>
                  <th className="text-left pb-2 font-medium">Furnisher</th>
                  <th className="text-right pb-2 font-medium">Tradelines</th>
                </tr>
              </thead>
              <tbody>
                {topFurnishers.map((f) => (
                  <tr key={f.rank} className="border-b border-border/30 last:border-0">
                    <td className="py-2 text-[10px] text-muted-foreground/50 w-6 tabular-nums">{f.rank}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <FurnisherLogo domain={f.domain} name={f.name} size="sm" />
                        <span className="text-[11px] font-normal text-foreground">{f.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-[11px] text-foreground/80 text-right tabular-nums">{f.tradelines}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
            <Link to="/furnishers" className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors mt-3">
              View all furnishers <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>

        {/* Alerts + Product Mix + Watchlist */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Recent Alerts */}
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11.5px] font-medium text-foreground">Recent Alerts</h3>
              <Link to="/alerts" className="text-[10px] text-primary/70 hover:text-primary transition-colors">View all</Link>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${a.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-normal text-foreground leading-snug">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{a.desc}</p>
                  </div>
                  <span className="text-[9.5px] text-muted-foreground/50 whitespace-nowrap mt-0.5">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Mix */}
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <h3 className="text-[11.5px] font-medium text-foreground mb-0.5">Product Mix</h3>
            <p className="text-[10px] text-muted-foreground/70 mb-3">Distribution by category</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
              <div className="w-28 h-28 flex-shrink-0 mx-auto sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={productMix} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={2}>
                      {productMix.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1">
                {productMix.map((p) => (
                  <div key={p.name} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-[10px] text-foreground">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Total Products {statsLoading ? "—" : totalProducts.toLocaleString()}</p>
          </div>

          {/* Watchlist Snapshot */}
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11.5px] font-medium text-foreground">Watchlist Snapshot</h3>
              <button className="text-[10px] text-primary/70 hover:text-primary transition-colors">View all</button>
            </div>
            <div className="overflow-x-auto"><table className="w-full min-w-[480px]">
              <thead>
                <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                  <th className="text-left pb-2 font-medium">Watchlist</th>
                  <th className="text-right pb-2 font-medium">Items</th>
                </tr>
              </thead>
              <tbody>
                {watchlistData.map((w) => (
                  <tr key={w.name} className="border-b border-border/30 last:border-0">
                    <td className="py-1.5 text-[11px] font-normal text-foreground">{w.name}</td>
                    <td className="py-1.5 text-[11px] text-foreground/80 text-right tabular-nums">{w.items}</td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-2 text-[10.5px] font-medium text-primary/80">Total</td>
                  <td className="pt-2 text-[10.5px] font-medium text-primary/80 text-right tabular-nums">74</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        {/* Recent Trade Activity */}
        <div className="bg-card rounded-lg border border-border/60 p-5">
          <h3 className="text-[11.5px] font-medium text-foreground mb-3">Recent Trade Activity</h3>
          <div className="overflow-x-auto"><table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                <th className="text-left pb-2 font-medium">Trade ID</th>
                <th className="text-left pb-2 font-medium">Furnisher</th>
                <th className="text-left pb-2 font-medium">Product</th>
                <th className="text-left pb-2 font-medium">Bureau</th>
                <th className="text-left pb-2 font-medium">Reported On</th>
                <th className="text-left pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tradeActivity.map((t) => (
                <tr key={t.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors">
                  <td className="py-2 text-[10px] text-muted-foreground/60 font-mono tabular-nums">{t.id}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <FurnisherLogo domain={t.domain} name={t.furnisher} size="sm" />
                      <span className="text-[11px] font-normal text-foreground">{t.furnisher}</span>
                    </div>
                  </td>
                  <td className="py-2 text-[11px] text-foreground/70">{t.product}</td>
                  <td className="py-2 text-[11px] text-foreground/70">{t.bureau}</td>
                  <td className="py-2 text-[10px] text-muted-foreground/60 tabular-nums">{t.date}</td>
                  <td className="py-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                      t.status === "Verified" ? "text-emerald-500" : "text-amber-500"
                    }`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <Link to="/tradelines" className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors mt-3 ml-auto">
            View all trade activity <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>

      {/* Right Insights Panel */}
      <div className="w-full lg:w-[260px] flex-shrink-0 min-w-0 space-y-4">
        <div className="bg-card rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
            <h3 className="text-[11.5px] font-medium text-foreground">Insights</h3>
          </div>

          {/* Coverage Summary */}
          <div className="mb-4">
            <h4 className="text-[10px] font-medium text-muted-foreground/70 mb-0.5 uppercase tracking-[0.06em]">Coverage</h4>
            <p className="text-[10px] text-muted-foreground/60 mb-2">Above industry average.</p>
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ value: 98.1 }, { value: 1.9 }]} dataKey="value" cx="50%" cy="50%" innerRadius={32} outerRadius={42} startAngle={90} endAngle={-270}>
                      <Cell fill="#4F46E5" />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[14px] font-semibold text-foreground">{bureauCoveragePct}</span>
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] text-muted-foreground/60 mt-1">Total Coverage</p>
            <p className="text-center text-[10px] text-emerald-500/80">↑ 2.4% vs last 30 days</p>
          </div>

          {/* Trend Spotlight */}
          <div className="mb-4">
            <h4 className="text-[10px] font-medium text-muted-foreground/70 mb-0.5 uppercase tracking-[0.06em]">Trend</h4>
            <p className="text-[10px] text-muted-foreground/60 mb-2">Tradelines up 11.8% vs Apr 2025.</p>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <Area type="monotone" dataKey="y" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Quality */}
          <div className="mb-4">
            <h4 className="text-[10px] font-medium text-muted-foreground/70 mb-0.5 uppercase tracking-[0.06em]">Data Quality</h4>
            <p className="text-[10px] text-muted-foreground/60 mb-2">High reliability from verified sources.</p>
            <p className="text-[14px] font-medium text-foreground leading-none">98.7%</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">Verified data</p>
            <div className="w-full h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
              <AnimatedBar value={98.7} />
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-[10px] font-medium text-muted-foreground/70 mb-2 uppercase tracking-[0.06em]">Activity</h4>
            <div className="space-y-2.5">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${a.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-normal text-foreground">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground/60">{a.desc}</p>
                    </div>
                    <span className="text-[9.5px] text-muted-foreground/50 whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
            <Link to="/alerts" className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors mt-2">
              View all activity <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}