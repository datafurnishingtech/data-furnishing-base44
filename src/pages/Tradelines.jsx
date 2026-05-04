import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { TrendingUp, ShieldCheck, Package, Globe, Search, Filter, Star, X, ChevronRight, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from "recharts";

const tradelines = [
  { name: "Synchrony Bank Credit Card", furnisher: "Synchrony Bank", type: "Credit Card", bureaus: ["TU", "EQ", "EX"], impactScore: 92, frequency: "Weekly", lastReported: "May 31, 2025", starred: true },
  { name: "Capital One Quicksilver", furnisher: "Capital One", type: "Credit Card", bureaus: ["TU", "EQ", "EX"], impactScore: 88, frequency: "Weekly", lastReported: "May 31, 2025" },
  { name: "American Express Gold Card", furnisher: "American Express", type: "Charge Card", bureaus: ["TU", "EQ", "EX"], impactScore: 87, frequency: "Weekly", lastReported: "May 31, 2025" },
  { name: "Citi Double Cash Card", furnisher: "Citi", type: "Credit Card", bureaus: ["TU", "EQ", "EX"], impactScore: 86, frequency: "Weekly", lastReported: "May 31, 2025" },
  { name: "Barclays Aviator Card", furnisher: "Barclays", type: "Credit Card", bureaus: ["TU", "EQ", "EX"], impactScore: 82, frequency: "Weekly", lastReported: "May 31, 2025" },
  { name: "Auto Loan – Prime", furnisher: "Ally Financial", type: "Auto Loan", bureaus: ["TU", "EQ", "EX"], impactScore: 81, frequency: "Monthly", lastReported: "May 30, 2025" },
  { name: "Personal Loan", furnisher: "LendingClub", type: "Personal Loan", bureaus: ["TU", "EQ"], impactScore: 78, frequency: "Monthly", lastReported: "May 30, 2025" },
  { name: "Mortgage – Fixed 30yr", furnisher: "Quicken Loans", type: "Mortgage", bureaus: ["TU", "EQ", "EX"], impactScore: 76, frequency: "Monthly", lastReported: "May 30, 2025" },
  { name: "Best Buy Credit Card", furnisher: "Citibank (Retail)", type: "Credit Card", bureaus: ["TU", "EQ", "EX"], impactScore: 74, frequency: "Monthly", lastReported: "May 30, 2025" },
  { name: "Student Loan", furnisher: "Nelnet", type: "Student Loan", bureaus: ["TU", "EQ", "EX"], impactScore: 72, frequency: "Monthly", lastReported: "May 30, 2025" },
];

const distributionData = [
  { range: "0–20", value: 900000, label: "0.9M" },
  { range: "21–40", value: 1800000, label: "1.8M" },
  { range: "41–60", value: 4200000, label: "4.2M" },
  { range: "61–80", value: 6700000, label: "6.7M" },
  { range: "81–100", value: 11000000, label: "11.0M" },
];

const impactPieData = [
  { name: "Payment History", value: 40, color: "#4F46E5" },
  { name: "Utilization", value: 25, color: "#8B5CF6" },
  { name: "Age of Acct.", value: 15, color: "#A78BFA" },
  { name: "Mix of Credit", value: 10, color: "#C4B5FD" },
  { name: "Other Factors", value: 10, color: "#DDD6FE" },
];

export default function Tradelines() {
  const [selected, setSelected] = useState(tradelines[0]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Tradeline Intelligence" subtitle="Explore what gets reported, how often, and which tradelines drive the most impact." />

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Tradelines" value="24.6M" change={11.8} icon={TrendingUp} />
          <StatCard label="High Impact Tradelines" value="8.2M" change={13.6} icon={ShieldCheck} />
          <StatCard label="Verified Products" value="7,312" change={15.1} icon={Package} />
          <StatCard label="Coverage Consistency" value="98.1%" change={2.4} icon={Globe} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tradelines by product or furnisher..." className="pl-9 h-8 text-xs" />
          </div>
          {["Product Type", "Bureau", "Impact Score", "Consumer / Business", "Reporting Frequency"].map((f) => (
            <Select key={f}>
              <SelectTrigger className="w-auto min-w-[100px] h-8 text-xs">
                <SelectValue placeholder={`All ${f.split(" ")[0]}s`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          ))}
          <button className="text-xs text-muted-foreground hover:text-foreground">Clear filters</button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Filter className="w-3 h-3" /> Filters
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Tradelines (24,621,831)</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 text-[10px] text-muted-foreground uppercase border-b border-border">
                <th className="w-8 px-3 py-2"></th>
                <th className="text-left px-3 py-2 font-medium">Product Name</th>
                <th className="text-left px-3 py-2 font-medium">Furnisher</th>
                <th className="text-left px-3 py-2 font-medium">Type</th>
                <th className="text-left px-3 py-2 font-medium">Bureaus</th>
                <th className="text-left px-3 py-2 font-medium">Impact Score</th>
                <th className="text-left px-3 py-2 font-medium">Reporting Frequency</th>
                <th className="text-left px-3 py-2 font-medium">Last Reported</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {tradelines.map((t) => (
                <tr
                  key={t.name}
                  onClick={() => setSelected(t)}
                  className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors ${
                    selected?.name === t.name ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-3 py-3">
                    <Star className={`w-3.5 h-3.5 ${t.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                  </td>
                  <td className="px-3 py-3 text-xs font-medium text-foreground">{t.name}</td>
                  <td className="px-3 py-3 text-xs text-foreground">{t.furnisher}</td>
                  <td className="px-3 py-3 text-xs text-foreground">{t.type}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      {t.bureaus.map((b) => (
                        <span key={b} className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">{b}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold text-white ${
                      t.impactScore >= 85 ? "bg-primary" : t.impactScore >= 75 ? "bg-primary/70" : "bg-primary/40"
                    }`}>
                      {t.impactScore}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-foreground">{t.frequency}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{t.lastReported}</td>
                  <td className="px-2"><ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Showing 1 to 10 of 24,621,831</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, "...", "2,462,183"].map((p, i) => (
                <button
                  key={i}
                  className={`min-w-[28px] h-7 text-xs rounded flex items-center justify-center px-1.5 ${
                    p === 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Score Distribution */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Impact Score Distribution</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">View by:</span>
              <Select>
                <SelectTrigger className="w-[120px] h-7 text-xs">
                  <SelectValue placeholder="Impact Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="impact">Impact Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {distributionData.map((_, i) => (
                    <Cell key={i} fill={i === distributionData.length - 1 ? "#4F46E5" : "#A78BFA"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-[280px] flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <h3 className="text-sm font-semibold">{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="w-full h-8 bg-muted/50">
                {["Overview", "Trend", "Bureaus", "Comparables"].map((t) => (
                  <TabsTrigger key={t} value={t.toLowerCase()} className="text-[10px] h-6">{t}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="mt-4 space-y-4">
              {/* Impact Score */}
              <div>
                <h4 className="text-xs font-semibold mb-2">Impact Score</h4>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ value: selected.impactScore }, { value: 100 - selected.impactScore }]} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={36} startAngle={90} endAngle={-270}>
                          <Cell fill="#4F46E5" />
                          <Cell fill="#E5E7EB" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold">{selected.impactScore}</span>
                      <span className="text-[8px] text-muted-foreground">High Impact</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {impactPieData.map((d) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-[10px] text-foreground">{d.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">97th percentile vs all products</p>
              </div>

              {/* Top Use Cases */}
              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-semibold mb-2">Top Use Cases</h4>
                {["Prime credit file building", "High-limit credit profile support", "Utilization optimization", "New to credit strengthening"].map((c) => (
                  <div key={c} className="flex items-center gap-2 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] text-foreground">{c}</span>
                  </div>
                ))}
                <button className="text-[10px] text-primary font-medium hover:underline mt-1">View all use cases →</button>
              </div>

              {/* Key Attributes */}
              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-semibold mb-2">Key Attributes</h4>
                <div className="space-y-1.5 text-[11px]">
                  {[
                    ["Furnisher", selected.furnisher],
                    ["Product Type", selected.type],
                    ["Bureaus Reported", selected.bureaus.join(", ")],
                    ["Reporting Frequency", selected.frequency],
                    ["Typical Account Age", "2+ years"],
                    ["Minimum Credit Limit", "$500"],
                    ["Average Limit", "$6,200"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verification Status</span>
                    <span className="text-emerald-500 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>
                <button className="text-[10px] text-primary font-medium hover:underline mt-2">View product profile →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}