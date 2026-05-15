import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Eye, Building2, Package, Shield, TrendingUp, Search, Filter, Star, MoreVertical, ArrowRight, Plus } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const watchlists = [
  { name: "High Priority Furnishers", desc: "Top-tier furnishers critical to our coverage", type: "Furnisher", items: 24, changes: 6, changePct: "25.0%", risk: "High", lastUpdated: "May 31, 2025", updatedAgo: "2h ago", owner: "Alex Kim", starred: true },
  { name: "Product Opportunities", desc: "High-impact products to add or expand", type: "Product", items: 38, changes: 9, changePct: "31.0%", risk: "Medium", lastUpdated: "May 31, 2025", updatedAgo: "4h ago", owner: "Alex Kim" },
  { name: "Coverage Gaps", desc: "Products and markets with low coverage", type: "Coverage", items: 31, changes: 12, changePct: "38.7%", risk: "High", lastUpdated: "May 31, 2025", updatedAgo: "1h ago", owner: "Jamie Lee" },
  { name: "Verification Watch", desc: "Entities with failed or expiring verification", type: "Furnisher", items: 16, changes: 4, changePct: "33.3%", risk: "Medium", lastUpdated: "May 31, 2025", updatedAgo: "3h ago", owner: "Alex Kim" },
  { name: "Competitive Tracking", desc: "Monitor competitor activity and expansion", type: "Competitive", items: 17, changes: 7, changePct: "53.8%", risk: "Low", lastUpdated: "May 31, 2025", updatedAgo: "5h ago", owner: "Taylor Morgan" },
];

const riskColors = { High: "text-destructive", Medium: "text-amber-600", Low: "text-emerald-600" };
const typeColors = { Furnisher: "text-primary", Product: "text-emerald-600", Coverage: "text-amber-600", Competitive: "text-purple-700" };

const recentChanges = [
  { furnisher: "Synchrony Bank", domain: "synchrony.com", change: "Coverage improved to 98%", time: "2h ago" },
  { furnisher: "Wells Fargo", domain: "wellsfargo.com", change: "Verification expired", time: "4h ago" },
  { furnisher: "Discover Financial", domain: "discover.com", change: "New product detected", time: "8h ago" },
  { furnisher: "Capital One", domain: "capitalone.com", change: "Coverage improved to 95%", time: "8h ago" },
  { furnisher: "Citibank (Retail)", domain: "citibank.com", change: "Coverage declined to 72%", time: "1d ago" },
];

const healthData = [
  { label: "High risk items", value: 23, change: 15.0 },
  { label: "Verification expired", value: 11, change: 22.2 },
  { label: "Coverage gaps", value: 31, change: 14.8 },
  { label: "New opportunities", value: 19, change: 26.7 },
  { label: "Stable items", value: 84, change: 5.0 },
];

const trendData = Array.from({ length: 14 }, (_, i) => ({ x: i, y: 80 + Math.random() * 15 }));

export default function Watchlists() {
  const [selected, setSelected] = useState(watchlists[0]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Watchlists" subtitle="Track priority entities and monitor market movements that matter most.">
          <Button className="bg-primary text-primary-foreground text-[11px] gap-1 h-7 px-2.5">
            <Plus className="w-3 h-3" /> New watchlist
          </Button>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <StatCard label="Total watchlists" value="18" change={12.5} />
          <StatCard label="Watched furnishers" value="126" change={10.3} />
          <StatCard label="Watched products" value="248" change={9.8} />
          <StatCard label="Coverage risk items" value="87" change={15.2} />
          <StatCard label="New movements" value="42" change={18.7} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-3">
          <TabsList className="bg-transparent p-0 h-auto border-b border-border/50 rounded-none w-full justify-start">
            {["All watchlists", "Furnishers", "Products", "Coverage", "Competitive"].map((t) => (
              <TabsTrigger key={t} value={t.toLowerCase().replace(" ", "_")} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-[11px] px-3 py-2">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
            <Input placeholder="Search watchlists..." className="pl-8 h-7 text-[11px] border-border/60" />
          </div>
          <Select><SelectTrigger className="w-[110px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal"><SelectValue placeholder="All types" /></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem></SelectContent></Select>
          <Select><SelectTrigger className="w-[110px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal"><SelectValue placeholder="All owners" /></SelectTrigger><SelectContent><SelectItem value="all">All owners</SelectItem></SelectContent></Select>
          <Button variant="outline" size="sm" className="gap-1 text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60"><Filter className="w-3 h-3" /> Filters</Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border/60 overflow-hidden mb-5">
          <table className="w-full">
            <thead>
              <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                <th className="w-10 px-3 py-2.5"><Checkbox className="w-3 h-3" /></th>
                <th className="text-left px-3 py-2.5 font-medium">Watchlist</th>
                <th className="text-left px-3 py-2.5 font-medium">Type</th>
                <th className="text-left px-3 py-2.5 font-medium">Items</th>
                <th className="text-left px-3 py-2.5 font-medium">Changes (30d)</th>
                <th className="text-left px-3 py-2.5 font-medium">Risk level</th>
                <th className="text-left px-3 py-2.5 font-medium">Last updated</th>
                <th className="text-left px-3 py-2.5 font-medium">Owner</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {watchlists.map((w) => (
                <tr key={w.name} onClick={() => setSelected(w)} className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${selected?.name === w.name ? "bg-primary/5" : ""}`}>
                  <td className="px-3 py-2.5">
                    {w.starred ? <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> : <Checkbox className="w-3 h-3" />}
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="text-[11px] font-normal text-foreground">{w.name}</p>
                    <p className="text-[10px] text-muted-foreground/60">{w.desc}</p>
                  </td>
                  <td className="px-3 py-2.5"><Badge className={`${typeColors[w.type]} text-[9.5px] px-1.5`}>{w.type}</Badge></td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70 tabular-nums">{w.items}</td>
                  <td className="px-3 py-2.5 text-[11px]">
                    <span className="text-emerald-500">↑ {w.changes}</span>
                    <span className="text-muted-foreground/60 ml-1 text-[10px]">{w.changePct}</span>
                  </td>
                  <td className="px-3 py-2.5"><Badge className={`${riskColors[w.risk]} text-[9.5px] px-1.5`}>{w.risk}</Badge></td>
                  <td className="px-3 py-2.5">
                    <p className="text-[10px] text-muted-foreground/60 tabular-nums">{w.lastUpdated}</p>
                    <p className="text-[10px] text-muted-foreground/50">{w.updatedAgo}</p>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70">{w.owner}</td>
                  <td className="px-2"><MoreVertical className="w-3 h-3 text-muted-foreground/30" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
            <span className="text-[10px] text-muted-foreground/60">Showing 1–5 of 18 watchlists</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((p) => (
                <button key={p} className={`w-6 h-6 text-[10px] rounded flex items-center justify-center ${p === 1 ? "bg-primary text-white" : "text-muted-foreground/60 hover:bg-muted"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Health Overview */}
        <div className="bg-card rounded-lg border border-border/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[11.5px] font-medium text-foreground">Watchlist Health Overview</h3>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">vs last 30 days</p>
            </div>
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors flex items-center gap-1">View full report <ArrowRight className="w-2.5 h-2.5" /></button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {healthData.map((h) => (
              <div key={h.label} className="text-center">
                <p className="text-[14px] font-medium text-foreground leading-none">{h.value}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">{h.label}</p>
                <p className="text-[10px] text-emerald-500 mt-0.5">↑ {h.change}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {selected && (
        <div className="w-[260px] flex-shrink-0">
          <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
                <h3 className="text-[11.5px] font-medium text-foreground">Selected watchlist</h3>
              </div>
              <button className="text-[10px] text-primary/70 hover:text-primary transition-colors">Edit</button>
            </div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] font-medium text-foreground">{selected.name}</span>
              <span className="text-[9px] font-medium text-emerald-600 px-1.5 py-0.5 rounded flex-shrink-0">Active</span>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mb-0.5">{selected.type} watchlist</p>
            <p className="text-[10px] text-muted-foreground/50 mb-3">{selected.items} items · Updated {selected.updatedAgo}</p>

            {/* Tabs */}
            <div className="flex gap-0 mb-3 border-b border-border/50">
              {["Overview", "Performance", "Members", "Activity"].map((t, i) => (
                <button key={t} className={`text-[10px] px-2 py-1.5 border-b-2 transition-colors ${i === 0 ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground/60 hover:text-foreground"}`}>{t}</button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Performance summary</h4>
                <div className="space-y-1.5">
                  {[["Coverage impact", "94%", "↑ 6pp"], ["Verification rate", "92%", "↑ 4pp"], ["Avg. risk score", "72", "↑ 3pts"], ["Movement count", "6", "↑ 25.0%"]].map(([k, v, delta]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-[10px] text-muted-foreground/60">{k}</span>
                      <span className="text-[10px] font-medium text-foreground">{v} <span className="text-emerald-500">{delta}</span></span>
                    </div>
                  ))}
                </div>
                <div className="h-10 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="y" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-2.5 border-t border-border/40">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em]">Recent changes</h4>
                  <button className="text-[10px] text-primary/70 hover:text-primary transition-colors">View all</button>
                </div>
                {recentChanges.map((c) => (
                  <div key={c.furnisher} className="flex items-start gap-2 py-1">
                    <FurnisherLogo domain={c.domain} name={c.furnisher} size="sm" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10.5px] font-medium text-foreground">{c.furnisher}</span>
                      <span className="text-[10px] text-muted-foreground/60"> · {c.change}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50 whitespace-nowrap">{c.time}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Recommended actions</h4>
                {["Review 4 expired verifications", "Add coverage for 3 high-risk gaps", "Prioritize 2 high-impact opportunities"].map((a) => (
                  <div key={a} className="flex items-center justify-between py-1">
                    <span className="text-[10.5px] text-foreground">{a}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}