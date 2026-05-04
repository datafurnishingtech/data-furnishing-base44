import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Eye, Building2, Package, Shield, TrendingUp, Search, Filter, Star, MoreVertical, ArrowRight, ArrowUp, Plus } from "lucide-react";
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

const riskColors = { High: "bg-destructive/10 text-destructive", Medium: "bg-amber-100 text-amber-700", Low: "bg-emerald-100 text-emerald-700" };
const typeColors = { Furnisher: "bg-primary/10 text-primary", Product: "bg-emerald-100 text-emerald-700", Coverage: "bg-amber-100 text-amber-700", Competitive: "bg-purple-100 text-purple-700" };

const recentChanges = [
  { furnisher: "Synchrony Bank", change: "Coverage improved to 98%", time: "2h ago" },
  { furnisher: "Wells Fargo", change: "Verification expired", time: "4h ago" },
  { furnisher: "Discover Financial", change: "New product detected", time: "8h ago" },
  { furnisher: "Capital One", change: "Coverage improved to 95%", time: "8h ago" },
  { furnisher: "Citibank (Retail)", change: "Coverage declined to 72%", time: "1d ago" },
];

const healthData = [
  { label: "High Risk Items", value: 23, change: 15.0 },
  { label: "Verification Expired", value: 11, change: 22.2 },
  { label: "Coverage Gaps", value: 31, change: 14.8 },
  { label: "New Opportunities", value: 19, change: 26.7 },
  { label: "Stable Items", value: 84, change: 5.0 },
];

const trendData = Array.from({ length: 14 }, (_, i) => ({ x: i, y: 80 + Math.random() * 15 }));

export default function Watchlists() {
  const [selected, setSelected] = useState(watchlists[0]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Watchlists" subtitle="Track priority entities and monitor market movements that matter most.">
          <Button className="bg-primary text-primary-foreground text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Watchlist
          </Button>
        </PageHeader>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatCard label="Total Watchlists" value="18" change={12.5} icon={Eye} />
          <StatCard label="Watched Furnishers" value="126" change={10.3} icon={Building2} />
          <StatCard label="Watched Products" value="248" change={9.8} icon={Package} />
          <StatCard label="Coverage Risk Items" value="87" change={15.2} icon={Shield} />
          <StatCard label="New Movements" value="42" change={18.7} icon={TrendingUp} />
        </div>

        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-transparent p-0 h-auto border-b border-border rounded-none w-full justify-start">
            {["All Watchlists", "Furnishers", "Products", "Coverage", "Competitive"].map((t) => (
              <TabsTrigger
                key={t}
                value={t.toLowerCase().replace(" ", "_")}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-xs px-4 py-2"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search watchlists..." className="pl-9 h-8 text-xs" />
          </div>
          <Select><SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem></SelectContent></Select>
          <Select><SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue placeholder="All Owners" /></SelectTrigger><SelectContent><SelectItem value="all">All Owners</SelectItem></SelectContent></Select>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8"><Filter className="w-3 h-3" /> Filters</Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 text-[10px] text-muted-foreground uppercase border-b border-border">
                <th className="w-10 px-3 py-2"><Checkbox className="w-3.5 h-3.5" /></th>
                <th className="text-left px-3 py-2 font-medium">Watchlist</th>
                <th className="text-left px-3 py-2 font-medium">Type</th>
                <th className="text-left px-3 py-2 font-medium">Items</th>
                <th className="text-left px-3 py-2 font-medium">Changes (30D)</th>
                <th className="text-left px-3 py-2 font-medium">Risk Level</th>
                <th className="text-left px-3 py-2 font-medium">Last Updated</th>
                <th className="text-left px-3 py-2 font-medium">Owner</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {watchlists.map((w) => (
                <tr
                  key={w.name}
                  onClick={() => setSelected(w)}
                  className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer ${selected?.name === w.name ? "bg-primary/5" : ""}`}
                >
                  <td className="px-3 py-3">
                    {w.starred ? <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> : <Checkbox className="w-3.5 h-3.5" />}
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs font-medium">{w.name}</p>
                    <p className="text-[10px] text-muted-foreground">{w.desc}</p>
                  </td>
                  <td className="px-3 py-3"><Badge className={`${typeColors[w.type]} border-0 text-[10px]`}>{w.type}</Badge></td>
                  <td className="px-3 py-3 text-xs">{w.items}</td>
                  <td className="px-3 py-3 text-xs">
                    <span className="text-emerald-500">↑ {w.changes}</span>
                    <span className="text-muted-foreground ml-1">{w.changePct}</span>
                  </td>
                  <td className="px-3 py-3"><Badge className={`${riskColors[w.risk]} border-0 text-[10px]`}>{w.risk}</Badge></td>
                  <td className="px-3 py-3">
                    <p className="text-xs">{w.lastUpdated}</p>
                    <p className="text-[10px] text-muted-foreground">{w.updatedAgo}</p>
                  </td>
                  <td className="px-3 py-3 text-xs">{w.owner}</td>
                  <td className="px-2"><MoreVertical className="w-3.5 h-3.5 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Showing 1 to 5 of 18 watchlists</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((p) => (
                <button key={p} className={`w-7 h-7 text-xs rounded flex items-center justify-center ${p === 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Health Overview */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Watchlist Health Overview</h3>
              <p className="text-xs text-muted-foreground">vs last 30 days</p>
            </div>
            <button className="text-xs text-primary font-medium hover:underline">View full report →</button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {healthData.map((h) => (
              <div key={h.label} className="text-center">
                <p className="text-xl font-bold">{h.value}</p>
                <p className="text-[10px] text-muted-foreground">{h.label}</p>
                <p className="text-[10px] text-emerald-500 mt-1">↑ {h.change}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {selected && (
        <div className="w-[280px] flex-shrink-0 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Selected Watchlist</h3>
              <button className="text-xs text-primary font-medium hover:underline">Edit</button>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold">{selected.name}</span>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[9px]">Active</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground mb-1">{selected.type} Watchlist</p>
            <p className="text-[10px] text-muted-foreground mb-4">{selected.items} items · Last updated {selected.updatedAgo}</p>

            <Tabs defaultValue="overview">
              <TabsList className="w-full h-7 bg-muted/50">
                {["Overview", "Performance", "Members", "Activity"].map((t) => (
                  <TabsTrigger key={t} value={t.toLowerCase()} className="text-[10px] h-5">{t}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="mt-4 space-y-3">
              <div>
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Performance Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">Coverage Impact</span><span className="font-medium">94% <span className="text-emerald-500">↑ 6pp</span></span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Verification Rate</span><span className="font-medium">92% <span className="text-emerald-500">↑ 4pp</span></span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Average Risk Score</span><span className="font-medium">72 <span className="text-emerald-500">↑ 3pts</span></span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Movement Count</span><span className="font-medium">6 <span className="text-emerald-500">↑ 25.0%</span></span></div>
                </div>
                <div className="h-12 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="y" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-semibold">Recent Changes</h4>
                  <button className="text-[10px] text-primary hover:underline">View all</button>
                </div>
                {recentChanges.map((c) => (
                  <div key={c.furnisher} className="flex items-start gap-2 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <div className="flex-1">
                      <span className="text-[11px] font-medium">{c.furnisher}</span>
                      <span className="text-[10px] text-muted-foreground"> · {c.change}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border">
                <h4 className="text-[10px] font-semibold mb-2">Recommended Actions</h4>
                {["Review 4 expired verifications", "Add coverage for 3 high-risk gaps", "Prioritize 2 high-impact opportunities"].map((a) => (
                  <div key={a} className="flex items-center justify-between py-1.5 group">
                    <span className="text-[11px] text-foreground">{a}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                ))}
                <button className="text-[10px] text-primary font-medium hover:underline mt-1">View all recommendations →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronRight(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
  );
}