import React, { useState, useMemo, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { ShieldCheck, Search, Filter, Star, X, ChevronRight, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const PRODUCT_TYPE_LABELS = {
  credit_builder_loan: "Credit Builder Loan",
  secured_card: "Secured Card",
  charge_card: "Charge Card",
  revolving_line: "Revolving Line",
  installment_account: "Installment",
  rent_reporting: "Rent Reporting",
  utility_reporting: "Utility Reporting",
  subscription_reporting: "Subscription",
  business_tradeline: "Business Tradeline",
  net_terms: "Net Terms",
  vendor_credit: "Vendor Credit",
  fleet_card: "Fleet Card",
  commercial_loan: "Commercial Loan",
  business_credit_card: "Business Credit Card",
  auto_loan: "Auto Loan",
  auto_lease: "Auto Lease",
  bnpl: "BNPL",
  pos_financing: "POS Financing",
  lease_to_own: "Lease to Own",
  specialty_data: "Specialty Data",
  bureau_data: "Bureau Data",
  api_infrastructure: "API Infrastructure",
  other: "Other",
};

const FREQUENCY_LABELS = {
  monthly: "Monthly",
  weekly: "Weekly",
  real_time: "Real-time",
  unknown: "—",
  other: "Other",
};

const distributionData = [
  { range: "0–20", value: 900000 },
  { range: "21–40", value: 1800000 },
  { range: "41–60", value: 4200000 },
  { range: "61–80", value: 6700000 },
  { range: "81–100", value: 11000000 },
];

const impactPieData = [
  { name: "Payment history", value: 40, color: "#4F46E5" },
  { name: "Utilization", value: 25, color: "#8B5CF6" },
  { name: "Age of acct.", value: 15, color: "#A78BFA" },
  { name: "Mix of credit", value: 10, color: "#C4B5FD" },
  { name: "Other factors", value: 10, color: "#DDD6FE" },
];

const PAGE_SIZE = 20;

export default function Tradelines() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date", 500),
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["companies-map"],
    queryFn: () => base44.entities.Company.list("-created_date", 500),
  });

  // Build a company lookup map
  const companyMap = useMemo(() => {
    const map = {};
    companies.forEach((c) => { map[c.id] = c; });
    return map;
  }, [companies]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const company = companyMap[p.company_id];
      const companyName = company?.company_name || "";
      const matchSearch =
        !search ||
        p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        companyName.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || p.product_type === typeFilter;
      const matchFreq = frequencyFilter === "all" || p.reporting_frequency === frequencyFilter;
      return matchSearch && matchType && matchFreq;
    });
  }, [products, companyMap, search, typeFilter, frequencyFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const verifiedCount = products.filter((p) => p.status === "verified").length;

  // Auto-select first on load
  React.useEffect(() => {
    if (products.length > 0 && !selected) setSelected(products[0]);
  }, [products]);

  const selectedCompany = selected ? companyMap[selected.company_id] : null;

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Tradeline Intelligence" subtitle="Explore what gets reported, how often, and which tradelines drive the most impact." />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard label="Total products" value={loadingProducts ? "—" : products.length.toLocaleString()} change={11.8} />
          <StatCard label="Verified products" value={loadingProducts ? "—" : verifiedCount.toLocaleString()} change={15.1} />
          <StatCard label="Furnishers represented" value={loadingProducts ? "—" : new Set(products.map((p) => p.company_id).filter(Boolean)).size.toLocaleString()} change={8.3} />
          <StatCard label="Coverage consistency" value="98.1%" change={2.4} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
            <Input
              placeholder="Search by product or furnisher..."
              className="pl-8 h-7 text-[11px] border-border/60"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-auto min-w-[130px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal">
              <SelectValue placeholder="Product type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {Object.entries(PRODUCT_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={frequencyFilter} onValueChange={(v) => { setFrequencyFilter(v); setPage(1); }}>
            <SelectTrigger className="w-auto min-w-[130px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal">
              <SelectValue placeholder="Reporting frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All frequencies</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="real_time">Real-time</SelectItem>
            </SelectContent>
          </Select>
          <button
            className="text-[11px] text-muted-foreground/60 hover:text-foreground"
            onClick={() => { setSearch(""); setTypeFilter("all"); setFrequencyFilter("all"); setPage(1); }}
          >
            Clear filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border/60 overflow-hidden mb-5">
          <div className="px-4 py-2.5 border-b border-border/50">
            <h3 className="text-[11.5px] font-medium text-foreground">
              Products <span className="text-muted-foreground/50 font-normal">({filtered.length.toLocaleString()})</span>
            </h3>
          </div>
          {loadingProducts ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                  <th className="text-left px-4 py-2.5 font-medium">Product name</th>
                  <th className="text-left px-3 py-2.5 font-medium">Furnisher</th>
                  <th className="text-left px-3 py-2.5 font-medium">Type</th>
                  <th className="text-left px-3 py-2.5 font-medium">Frequency</th>
                  <th className="text-left px-3 py-2.5 font-medium">Audience</th>
                  <th className="text-left px-3 py-2.5 font-medium">Status</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => {
                  const company = companyMap[p.company_id];
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${
                        selected?.id === p.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 text-[11px] font-normal text-foreground max-w-[200px] truncate">
                        {p.product_name}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-foreground/70">
                        {company?.company_name || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-foreground/70">
                        {PRODUCT_TYPE_LABELS[p.product_type] || p.product_type}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-foreground/70">
                        {FREQUENCY_LABELS[p.reporting_frequency] || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-foreground/70 capitalize">
                        {p.consumer_or_business || "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                          p.status === "verified"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : p.status === "pending_review"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {p.status || "draft"}
                        </span>
                      </td>
                      <td className="px-2"><ChevronRight className="w-3 h-3 text-muted-foreground/30" /></td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[11px] text-muted-foreground/60">
                      No products match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
            <span className="text-[10px] text-muted-foreground/60">
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-6 h-6 text-[10px] rounded flex items-center justify-center ${
                    p === page ? "bg-primary text-white" : "text-muted-foreground/60 hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 5 && <span className="text-[10px] text-muted-foreground/40">...</span>}
            </div>
          </div>
        </div>

        {/* Impact Score Distribution */}
        <div className="bg-card rounded-lg border border-border/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[11.5px] font-medium text-foreground">Impact score distribution</h3>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Tradelines by score range</p>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} axisLine={false} tickLine={false} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {distributionData.map((_, i) => (
                    <Cell key={i} fill={i === distributionData.length - 1 ? "#4F46E5" : "#A78BFA"} fillOpacity={i === distributionData.length - 1 ? 1 : 0.5} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-[260px] flex-shrink-0">
          <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-0.5 h-3.5 bg-primary/60 rounded-full flex-shrink-0" />
                <h3 className="text-[11.5px] font-medium text-foreground truncate">{selected.product_name}</h3>
              </div>
              <button onClick={() => setSelected(null)}><X className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" /></button>
            </div>

            <div className="space-y-3">
              {/* Donut */}
              <div>
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Impact score</h4>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[{ value: selected.confidence_score || 50 }, { value: 100 - (selected.confidence_score || 50) }]}
                          dataKey="value" cx="50%" cy="50%" innerRadius={22} outerRadius={30} startAngle={90} endAngle={-270}
                        >
                          <Cell fill="#4F46E5" />
                          <Cell fill="#E5E7EB" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[14px] font-semibold text-foreground leading-none">
                        {selected.confidence_score || "—"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 flex-1">
                    {impactPieData.map((d) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                        <span className="text-[10px] text-foreground truncate">{d.name}</span>
                        <span className="text-[10px] text-muted-foreground/60 ml-auto tabular-nums">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Attributes */}
              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Key attributes</h4>
                <div className="space-y-1.5">
                  {[
                    ["Furnisher", selectedCompany?.company_name || "—"],
                    ["Product type", PRODUCT_TYPE_LABELS[selected.product_type] || selected.product_type],
                    ["Reporting frequency", FREQUENCY_LABELS[selected.reporting_frequency] || "—"],
                    ["Audience", selected.consumer_or_business || "—"],
                    ["Monthly cost", selected.monthly_cost != null ? `$${selected.monthly_cost}` : "—"],
                    ["Setup fee", selected.setup_fee != null ? `$${selected.setup_fee}` : "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-[10px] text-muted-foreground/60">{k}</span>
                      <span className="text-[10px] font-medium text-foreground text-right capitalize">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground/60">Status</span>
                    <span className={`text-[10px] font-medium flex items-center gap-1 ${
                      selected.status === "verified" ? "text-emerald-500" : "text-muted-foreground"
                    }`}>
                      {selected.status === "verified" && <ShieldCheck className="w-2.5 h-2.5" />}
                      {selected.status || "draft"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selected.description && (
                <div className="pt-2.5 border-t border-border/40">
                  <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Description</h4>
                  <p className="text-[10.5px] text-muted-foreground/80 leading-relaxed line-clamp-4">{selected.description}</p>
                </div>
              )}

              {selectedCompany && (
                <div className="pt-2.5 border-t border-border/40">
                  <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Furnisher</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10.5px] font-medium text-foreground">{selectedCompany.company_name}</p>
                      {selectedCompany.headquarters_location && (
                        <p className="text-[10px] text-muted-foreground/60">{selectedCompany.headquarters_location}</p>
                      )}
                    </div>
                    {selectedCompany.verification_status === "verified" && (
                      <span className="text-[9px] font-medium bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded flex-shrink-0">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}