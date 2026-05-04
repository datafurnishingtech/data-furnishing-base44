import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Building2, ShieldCheck, UserPlus, Globe, Search, Filter, MoreVertical, CheckCircle2, Clock, X, ArrowRight, ExternalLink } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const furnishers = [
  { name: "Synchrony Bank", domain: "synchrony.com", category: "Financial Services", products: 12, bureaus: ["TU", "EQ", "EX"], volume: "2.3M", verification: "Verified", lastUpdated: "May 31, 2025" },
  { name: "Capital One", domain: "capitalone.com", category: "Financial Services", products: 15, bureaus: ["TU", "EQ", "EX"], volume: "2.2M", verification: "Verified", lastUpdated: "May 31, 2025" },
  { name: "American Express", domain: "americanexpress.com", category: "Financial Services", products: 9, bureaus: ["TU", "EQ", "EX"], volume: "1.5M", verification: "Verified", lastUpdated: "May 31, 2025" },
  { name: "Citi", domain: "citi.com", category: "Financial Services", products: 10, bureaus: ["TU", "EQ", "EX"], volume: "1.5M", verification: "Verified", lastUpdated: "May 31, 2025" },
  { name: "Barclays", domain: "barclays.com", category: "Financial Services", products: 8, bureaus: ["TU", "EQ", "EX"], volume: "1.2M", verification: "Pending", lastUpdated: "May 31, 2025" },
  { name: "Wells Fargo", domain: "wellsfargo.com", category: "Financial Services", products: 14, bureaus: ["TU", "EQ", "EX"], volume: "1.1M", verification: "Verified", lastUpdated: "May 31, 2025" },
  { name: "Discover Financial", domain: "discover.com", category: "Financial Services", products: 7, bureaus: ["TU", "EQ", "EX"], volume: "960K", verification: "Verified", lastUpdated: "May 30, 2025" },
  { name: "Chase", domain: "chase.com", category: "Financial Services", products: 13, bureaus: ["TU", "EQ", "EX"], volume: "872K", verification: "Verified", lastUpdated: "May 30, 2025" },
  { name: "U.S. Bank", domain: "usbank.com", category: "Financial Services", products: 11, bureaus: ["TU", "EQ"], volume: "745K", verification: "Verified", lastUpdated: "May 30, 2025" },
  { name: "Ally Financial", domain: "ally.com", category: "Financial Services", products: 8, bureaus: ["TU", "EQ"], volume: "615K", verification: "Verified", lastUpdated: "May 29, 2025" },
  { name: "Navient", domain: "navient.com", category: "Financial Services", products: 6, bureaus: ["TU", "EQ", "EX"], volume: "502K", verification: "Verified", lastUpdated: "May 29, 2025" },
  { name: "Experian RentBureau", domain: "rentbureau.com", category: "Rent Reporting", products: 4, bureaus: ["TU", "EQ", "EX"], volume: "430K", verification: "Verified", lastUpdated: "May 29, 2025" },
  { name: "TransUnion Auto", domain: "transunion.com", category: "Auto Lending", products: 5, bureaus: ["TU"], volume: "321K", verification: "Verified", lastUpdated: "May 28, 2025" },
];



export default function Furnishers() {
  const [selected, setSelected] = useState(furnishers[0]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Furnisher Registry" subtitle="Discover, profile, and compare verified furnishers." />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard label="Total furnishers" value="2,847" change={12.5} />
          <StatCard label="Verified furnishers" value="1,842" change={10.3} />
          <StatCard label="New this month" value="128" change={8.7} />
          {/* Avg Coverage mini card */}
          <div className="bg-card rounded-lg border border-border/60 px-4 py-3.5 flex flex-col gap-2 min-w-0">
            <span className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground/70 truncate whitespace-nowrap">
              Avg. coverage score
            </span>
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ value: 98.1 }, { value: 1.9 }]} dataKey="value" cx="50%" cy="50%" innerRadius={14} outerRadius={18} startAngle={90} endAngle={-270}>
                      <Cell fill="#4F46E5" />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-semibold text-foreground">98%</span>
                </div>
              </div>
              <div>
                <p className="text-[22px] font-semibold text-foreground leading-none tracking-tight">98.1%</p>
                <p className="text-[10px] text-emerald-500 mt-0.5">↑ 2.4% vs 30d</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {["Industry", "Bureau coverage", "Reporting type", "Verification status", "Date updated"].map((f) => (
            <Select key={f}>
              <SelectTrigger className="w-auto min-w-[110px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal">
                <SelectValue placeholder={f} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          ))}
          <Button variant="outline" size="sm" className="gap-1 text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">
            <Filter className="w-3 h-3" /> More filters
          </Button>
          <button className="text-[11px] text-primary/70 hover:text-primary font-normal ml-auto">Clear all</button>
        </div>

        {/* Search + results count */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
            <Input placeholder="Search furnishers by name..." className="pl-8 h-7 text-[11px] border-border/60" />
          </div>
          <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">2,847 results</span>
          <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">Export</Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border/60 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                <th className="text-left px-4 py-2.5 font-medium">Furnisher</th>
                <th className="text-left px-3 py-2.5 font-medium">Category</th>
                <th className="text-left px-3 py-2.5 font-medium">Products</th>
                <th className="text-left px-3 py-2.5 font-medium">Bureaus</th>
                <th className="text-left px-3 py-2.5 font-medium">Volume ↓</th>
                <th className="text-left px-3 py-2.5 font-medium">Verification</th>
                <th className="text-left px-3 py-2.5 font-medium">Last updated</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {furnishers.map((f) => (
                <tr
                  key={f.name}
                  onClick={() => setSelected(f)}
                  className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${
                    selected?.name === f.name ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <FurnisherLogo domain={f.domain} name={f.name} size="sm" />
                      <div>
                        <p className="text-[11px] font-normal text-foreground">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground/60">{f.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70">{f.category}</td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70 tabular-nums">{f.products}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      {f.bureaus.map((b) => (
                        <span key={b} className="text-[9.5px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] font-normal text-foreground tabular-nums">{f.volume}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                      f.verification === "Verified" ? "text-emerald-500" : "text-amber-500"
                    }`}>
                      {f.verification === "Verified" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                      {f.verification}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[10px] text-muted-foreground/60 tabular-nums">{f.lastUpdated}</td>
                  <td className="px-2 py-2.5">
                    <MoreVertical className="w-3.5 h-3.5 text-muted-foreground/40" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
            <div className="flex items-center gap-1">
              {[1, 2, 3, "...", 143].map((p, i) => (
                <button
                  key={i}
                  className={`w-6 h-6 text-[10px] rounded flex items-center justify-center ${
                    p === 1 ? "bg-primary text-white" : "text-muted-foreground/60 hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground/60">20 / page</span>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-[260px] flex-shrink-0">
          <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 ">
                <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
                <h3 className="text-[11.5px] font-medium text-foreground truncate">{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)}>
                <X className="w-3.5 h-3.5 text-muted-foreground/50" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 mb-4">
              <FurnisherLogo domain={selected.domain} name={selected.name} size="lg" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-foreground truncate">{selected.name}</span>
                  {selected.verification === "Verified" && (
                    <span className="text-[9px] font-medium bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded flex-shrink-0">Verified</span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1 mt-0.5">
                  {selected.domain} <ExternalLink className="w-2.5 h-2.5" />
                </p>
                <p className="text-[10px] text-muted-foreground/60">{selected.category}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mb-4 border-b border-border/50">
              {["Overview", "Products", "Coverage", "Activity"].map((t, i) => (
                <button
                  key={t}
                  className={`text-[10.5px] px-2.5 py-1.5 border-b-2 transition-colors ${
                    i === 0 ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground/60 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {/* Profile summary */}
              <div>
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Profile summary</h4>
                <p className="text-[10.5px] text-muted-foreground/80 leading-relaxed">
                  {selected.name} is a leading consumer financial services company providing credit cards, private label cards, and installment loans.
                </p>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                {[
                  ["Headquarters", "Stamford, CT"],
                  ["Founded", "1932"],
                  ["Employees", "18,000+"],
                  ["Reporting since", "2005"],
                  ["Furnisher ID", "SYNC-001"],
                  ["External ID", "1029384756"],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-[9.5px] text-muted-foreground/60">{label}</p>
                    <p className="text-[10.5px] font-medium text-foreground">{val}</p>
                  </div>
                ))}
              </div>

              {/* Coverage */}
              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Coverage summary</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-[18px] font-semibold text-foreground leading-none">98.1%</span>
                  <span className="text-[9.5px] font-medium text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">High coverage</span>
                </div>
                <div className="w-full h-1 bg-muted rounded-full mt-2">
                  <div className="h-full bg-primary rounded-full" style={{ width: "98.1%" }} />
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-muted-foreground/60">3 / 3 bureaus</span>
                  {["TU", "EQ", "EX"].map((b) => (
                    <span key={b} className="text-[9.5px] font-medium bg-muted text-foreground/70 px-1.5 py-0.5 rounded">{b}</span>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Products</h4>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-[16px] font-semibold text-foreground leading-none">{selected.products}</p>
                    <p className="text-[9.5px] text-muted-foreground/60 mt-0.5">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-semibold text-emerald-500 leading-none">8</p>
                    <p className="text-[9.5px] text-muted-foreground/60 mt-0.5">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-semibold text-muted-foreground leading-none">4</p>
                    <p className="text-[9.5px] text-muted-foreground/60 mt-0.5">Inactive</p>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors mt-2">
                  View all products <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

              <button className="w-full mt-1 bg-primary text-primary-foreground text-[11px] font-medium h-7 rounded-md flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors">
                View full profile <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}