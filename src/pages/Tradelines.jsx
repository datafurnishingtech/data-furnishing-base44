import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { TrendingUp, ShieldCheck, Package, Globe, Search, Filter, Star, X, ChevronRight, ArrowRight } from "lucide-react";
import TablePagination from "@/components/shared/TablePagination";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const tradelines = [
  { name: "Synchrony Bank Credit Card", furnisher: "Synchrony Bank", domain: "synchrony.com", type: "Credit Card", bureaus: ["TU", "EQ", "EX"], impactScore: 92, frequency: "Weekly", lastReported: "May 31, 2025", starred: true },
  { name: "Capital One Quicksilver", furnisher: "Capital One", domain: "capitalone.com", type: "Credit Card", bureaus: ["TU", "EQ", "EX"], impactScore: 88, frequency: "Weekly", lastReported: "May 31, 2025" },
  { name: "American Express Gold Card", furnisher: "American Express", domain: "americanexpress.com", type: "Charge Card", bureaus: ["TU", "EQ", "EX"], impactScore: 87, frequency: "Weekly", lastReported: "May 31, 2025" },
  { name: "Citi Double Cash Card", furnisher: "Citi", domain: "citibank.com", type: "Credit Card", bureaus: ["TU", "EQ", "EX"], impactScore: 86, frequency: "Weekly", lastReported: "May 31, 2025" },
  { name: "Barclays Aviator Card", furnisher: "Barclays", domain: "barclays.co.uk", type: "Credit Card", bureaus: ["TU", "EQ", "EX"], impactScore: 82, frequency: "Weekly", lastReported: "May 31, 2025" },
  { name: "Auto Loan – Prime", furnisher: "Ally Financial", domain: "ally.com", type: "Auto Loan", bureaus: ["TU", "EQ", "EX"], impactScore: 81, frequency: "Monthly", lastReported: "May 30, 2025" },
  { name: "Personal Loan", furnisher: "LendingClub", domain: "lendingclub.com", type: "Personal Loan", bureaus: ["TU", "EQ"], impactScore: 78, frequency: "Monthly", lastReported: "May 30, 2025" },
  { name: "Mortgage – Fixed 30yr", furnisher: "Quicken Loans", domain: "quickenloans.com", type: "Mortgage", bureaus: ["TU", "EQ", "EX"], impactScore: 76, frequency: "Monthly", lastReported: "May 30, 2025" },
  { name: "Best Buy Credit Card", furnisher: "Citibank (Retail)", domain: "citibank.com", type: "Credit Card", bureaus: ["TU", "EQ", "EX"], impactScore: 74, frequency: "Monthly", lastReported: "May 30, 2025" },
  { name: "Student Loan", furnisher: "Nelnet", domain: "nelnet.com", type: "Student Loan", bureaus: ["TU", "EQ", "EX"], impactScore: 72, frequency: "Monthly", lastReported: "May 30, 2025" },
];

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

export default function Tradelines() {
  const [selected, setSelected] = useState(tradelines[0]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(tradelines.length / pageSize);
  const paginated = tradelines.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-w-0">
      <div className="flex-1 min-w-0">
        <PageHeader title="Tradeline Intelligence" subtitle="Explore what gets reported, how often, and which tradelines drive the most impact." />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total tradelines" value="24.6M" change={11.8} />
          <StatCard label="High-impact tradelines" value="8.2M" change={13.6} />
          <StatCard label="Verified products" value="7,312" change={15.1} />
          <StatCard label="Coverage consistency" value="98.1%" change={2.4} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
            <Input placeholder="Search by product or furnisher..." className="pl-8 h-7 text-[11px] border-border/60" />
          </div>
          {["Product type", "Bureau", "Impact score", "Reporting frequency"].map((f) => (
            <Select key={f}>
              <SelectTrigger className="w-auto min-w-[100px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal">
                <SelectValue placeholder={f} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          ))}
          <button className="text-[11px] text-muted-foreground/60 hover:text-foreground">Clear filters</button>
          <Button variant="outline" size="sm" className="gap-1 text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">
            <Filter className="w-3 h-3" /> Filters
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border/60 overflow-hidden mb-5">
          <div className="px-4 py-2.5 border-b border-border/50">
            <h3 className="text-[11.5px] font-medium text-foreground">Tradelines <span className="text-muted-foreground/50 font-normal">(24,621,831)</span></h3>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                <th className="w-8 px-3 py-2.5"></th>
                <th className="text-left px-3 py-2.5 font-medium">Product name</th>
                <th className="text-left px-3 py-2.5 font-medium">Furnisher</th>
                <th className="text-left px-3 py-2.5 font-medium">Type</th>
                <th className="text-left px-3 py-2.5 font-medium">Bureaus</th>
                <th className="text-left px-3 py-2.5 font-medium">Impact score</th>
                <th className="text-left px-3 py-2.5 font-medium">Frequency</th>
                <th className="text-left px-3 py-2.5 font-medium">Last reported</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t) => (
                <tr
                  key={t.name}
                  onClick={() => setSelected(t)}
                  className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${
                    selected?.name === t.name ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-3 py-2.5">
                    <Star className={`w-3 h-3 ${t.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                  </td>
                  <td className="px-3 py-2.5 text-[11px] font-normal text-foreground">{t.name}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <FurnisherLogo domain={t.domain} name={t.furnisher} size="sm" />
                      <span className="text-[11px] text-foreground/70">{t.furnisher}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70">{t.type}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      {t.bureaus.map((b) => (
                        <span key={b} className="text-[9.5px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">{b}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center justify-center w-8 h-5 rounded text-[10px] font-semibold text-white ${
                      t.impactScore >= 85 ? "bg-primary" : t.impactScore >= 75 ? "bg-primary/70" : "bg-primary/40"
                    }`}>
                      {t.impactScore}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70">{t.frequency}</td>
                  <td className="px-3 py-2.5 text-[10px] text-muted-foreground/60 tabular-nums">{t.lastReported}</td>
                  <td className="px-2"><ChevronRight className="w-3 h-3 text-muted-foreground/30" /></td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={tradelines.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
          />
        </div>

        {/* Impact Score Distribution */}
        <div className="bg-card rounded-lg border border-border/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[11.5px] font-medium text-foreground">Impact Score Distribution</h3>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Tradelines by score range</p>
            </div>
            <Select>
              <SelectTrigger className="w-[120px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal">
                <SelectValue placeholder="Impact score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impact">Impact score</SelectItem>
              </SelectContent>
            </Select>
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
        <div className="w-full lg:w-[260px] flex-shrink-0 min-w-0">
          <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
                <h3 className="text-[11.5px] font-medium text-foreground truncate">{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)}><X className="w-3.5 h-3.5 text-muted-foreground/50" /></button>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mb-4 border-b border-border/50">
              {["Overview", "Trend", "Bureaus", "Comparables"].map((t, i) => (
                <button
                  key={t}
                  className={`text-[10.5px] px-2 py-1.5 border-b-2 transition-colors ${
                    i === 0 ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground/60 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {/* Impact Score */}
              <div>
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Impact score</h4>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ value: selected.impactScore }, { value: 100 - selected.impactScore }]} dataKey="value" cx="50%" cy="50%" innerRadius={22} outerRadius={30} startAngle={90} endAngle={-270}>
                          <Cell fill="#4F46E5" />
                          <Cell fill="#E5E7EB" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[14px] font-semibold text-foreground leading-none">{selected.impactScore}</span>
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
                <p className="text-[10px] text-muted-foreground/60 mt-1.5">97th percentile vs all products</p>
              </div>

              {/* Top Use Cases */}
              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Top use cases</h4>
                {["Prime credit file building", "High-limit credit profile support", "Utilization optimization", "New to credit strengthening"].map((c) => (
                  <div key={c} className="flex items-center gap-2 py-0.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-[10.5px] text-foreground/80">{c}</span>
                  </div>
                ))}
                <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-1.5 flex items-center gap-1">
                  View all use cases <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Key Attributes */}
              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Key attributes</h4>
                <div className="space-y-1.5">
                  {[
                    ["Furnisher", selected.furnisher],
                    ["Product type", selected.type],
                    ["Bureaus reported", selected.bureaus.join(", ")],
                    ["Reporting frequency", selected.frequency],
                    ["Typical account age", "2+ years"],
                    ["Min. credit limit", "$500"],
                    ["Average limit", "$6,200"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-[10px] text-muted-foreground/60">{k}</span>
                      <span className="text-[10px] font-medium text-foreground text-right">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground/60">Verification status</span>
                    <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" /> Verified
                    </span>
                  </div>
                </div>
                <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-2 flex items-center gap-1">
                  View product profile <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}