import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Building2, ShieldCheck, UserPlus, Globe, Search, Filter, MoreVertical, CheckCircle2, Clock, X, ArrowRight, ExternalLink } from "lucide-react";
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
  { name: "U.S. Bank", domain: "usbank.com", category: "Financial Services", products: 11, bureaus: ["TU", "EQ", "EX"], volume: "745K", verification: "Verified", lastUpdated: "May 30, 2025" },
  { name: "Ally Financial", domain: "ally.com", category: "Financial Services", products: 8, bureaus: ["TU", "EQ"], volume: "615K", verification: "Verified", lastUpdated: "May 29, 2025" },
  { name: "Navient", domain: "navient.com", category: "Financial Services", products: 6, bureaus: ["TU", "EQ", "EX"], volume: "502K", verification: "Verified", lastUpdated: "May 29, 2025" },
  { name: "Experian RentBureau", domain: "rentbureau.com", category: "Rent Reporting", products: 4, bureaus: ["TU", "EQ", "EX"], volume: "430K", verification: "Verified", lastUpdated: "May 29, 2025" },
  { name: "TransUnion Auto", domain: "transunion.com", category: "Auto Lending", products: 5, bureaus: ["TU"], volume: "321K", verification: "Verified", lastUpdated: "May 28, 2025" },
];

const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2);

export default function Furnishers() {
  const [selected, setSelected] = useState(furnishers[0]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Furnisher Registry" subtitle="Discover, profile, and compare verified furnishers." />

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Furnishers" value="2,847" change={12.5} icon={Building2} />
          <StatCard label="Verified Furnishers" value="1,842" change={10.3} icon={ShieldCheck} />
          <StatCard label="New This Month" value="128" change={8.7} icon={UserPlus} />
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Avg Coverage Score</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ value: 98.1 }, { value: 1.9 }]} dataKey="value" cx="50%" cy="50%" innerRadius={20} outerRadius={26} startAngle={90} endAngle={-270}>
                      <Cell fill="#4F46E5" />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">98.1%</span>
                </div>
              </div>
              <span className="text-xs text-emerald-500">↑ 2.4% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {["Industry", "Bureau Coverage", "Reporting Type", "Verification Status", "Date Updated"].map((f) => (
            <Select key={f}>
              <SelectTrigger className="w-auto min-w-[120px] h-8 text-xs">
                <SelectValue placeholder={f === "Industry" ? "All Industries" : "All"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          ))}
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Filter className="w-3 h-3" /> More Filters
          </Button>
          <button className="text-xs text-primary font-medium hover:underline ml-auto">Clear all</button>
        </div>

        {/* Search + results */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search furnishers by name..." className="pl-9 h-9 text-sm" />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">2,847 results</span>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">Export</Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 text-[10px] text-muted-foreground uppercase border-b border-border">
                <th className="text-left px-4 py-3 font-medium">Furnisher</th>
                <th className="text-left px-3 py-3 font-medium">Category</th>
                <th className="text-left px-3 py-3 font-medium">Products</th>
                <th className="text-left px-3 py-3 font-medium">Bureaus</th>
                <th className="text-left px-3 py-3 font-medium">Volume ↓</th>
                <th className="text-left px-3 py-3 font-medium">Verification</th>
                <th className="text-left px-3 py-3 font-medium">Last Updated</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {furnishers.map((f) => (
                <tr
                  key={f.name}
                  onClick={() => setSelected(f)}
                  className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors ${
                    selected?.name === f.name ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                        {initials(f.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground">{f.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-foreground">{f.category}</td>
                  <td className="px-3 py-3 text-xs text-foreground">{f.products}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      {f.bureaus.map((b) => (
                        <span key={b} className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs font-medium text-foreground">{f.volume}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs ${
                      f.verification === "Verified" ? "text-emerald-500" : "text-amber-500"
                    }`}>
                      {f.verification === "Verified" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {f.verification}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{f.lastUpdated}</td>
                  <td className="px-2 py-3">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="flex items-center gap-1">
              {[1, 2, 3, "...", 143].map((p, i) => (
                <button
                  key={i}
                  className={`w-7 h-7 text-xs rounded flex items-center justify-center ${
                    p === 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">20 / page</span>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-[280px] flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{selected.name}</h3>
              <button onClick={() => setSelected(null)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {initials(selected.name)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{selected.name}</span>
                  {selected.verification === "Verified" && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] px-1.5 h-4">Verified</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {selected.domain} <ExternalLink className="w-2.5 h-2.5" />
                </p>
                <p className="text-xs text-muted-foreground">{selected.category}</p>
              </div>
            </div>

            <div className="flex gap-1 mb-4 border-b border-border">
              {["Overview", "Products", "Coverage", "Activity"].map((t, i) => (
                <button
                  key={t}
                  className={`text-xs px-3 py-2 font-medium border-b-2 transition-colors ${
                    i === 0 ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">Profile Summary</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {selected.name} is a leading consumer financial services company providing financial credit cards, private label cards, and installment loans.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="text-muted-foreground">Headquarters</span><p className="font-medium">Stamford, CT</p></div>
                <div><span className="text-muted-foreground">Founded</span><p className="font-medium">1932</p></div>
                <div><span className="text-muted-foreground">Employees</span><p className="font-medium">18,000+</p></div>
                <div><span className="text-muted-foreground">Reporting Since</span><p className="font-medium">2005</p></div>
                <div><span className="text-muted-foreground">Furnisher ID</span><p className="font-medium">SYNC-001</p></div>
                <div><span className="text-muted-foreground">External ID</span><p className="font-medium">1029384756</p></div>
              </div>

              <div className="pt-2 border-t border-border">
                <h4 className="text-xs font-semibold text-foreground mb-2">Coverage Summary</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">98.1%</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">High Coverage</Badge>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full mt-2">
                  <div className="h-full bg-primary rounded-full" style={{ width: "98.1%" }} />
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] text-muted-foreground">3 / 3 Bureaus</span>
                  {["TU", "EQ", "EX"].map((b) => (
                    <span key={b} className="text-[10px] font-medium bg-muted text-foreground px-1.5 py-0.5 rounded">{b}</span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <h4 className="text-xs font-semibold text-foreground mb-2">Products</h4>
                <div className="flex gap-4 text-center">
                  <div><p className="text-sm font-bold">{selected.products}</p><p className="text-[10px] text-muted-foreground">Total Products</p></div>
                  <div><p className="text-sm font-bold text-emerald-500">8</p><p className="text-[10px] text-muted-foreground">Active Products</p></div>
                  <div><p className="text-sm font-bold text-muted-foreground">4</p><p className="text-[10px] text-muted-foreground">Inactive Products</p></div>
                </div>
                <button className="flex items-center gap-1 text-[10px] text-primary font-medium hover:underline mt-2">View all products <ArrowRight className="w-2.5 h-2.5" /></button>
              </div>

              <Button className="w-full mt-2 bg-primary text-primary-foreground text-xs">
                View Full Profile <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}